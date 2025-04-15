resource "aws_amplify_app" "animus_app" {
  name       = "animus"
  repository = "https://github.com/maciejgrosz/animus"

  build_spec = <<EOF
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - |
          bash -c '
            set -e
            echo "📥 Installing NVM..."
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

            echo "🌀 Setting up NVM..."
            export NVM_DIR=$HOME/.nvm
            source $NVM_DIR/nvm.sh

            echo "⬇️ Installing Node.js v20..."
            nvm install 20
            nvm use 20

            echo "🔍 Checking vite install..."
            npm ls vite || {
              echo "⚠️ vite not found in node_modules. Cleaning and reinstalling..."
              rm -rf node_modules package-lock.json
              npm install
            }

            echo "📄 Showing package.json..."
            cat package.json

            echo "📂 node_modules/.bin content:"
            ls -l ./node_modules/.bin

            echo "📦 vite version check via npx:"
            npx vite --version || echo "❌ vite still not available via npx"
          '
    build:
      commands:
        - |
          bash -c '
            set -e
            export NVM_DIR=$HOME/.nvm
            source $NVM_DIR/nvm.sh
            nvm use 20

            echo "🛠️ Using Node version: $(node -v)"
            echo "📦 Using NPM version: $(npm -v)"
            echo "📂 Listing node_modules/.bin"
            ls -l ./node_modules/.bin
            ls -la

            if [ ! -f ./node_modules/.bin/vite ]; then
              echo "❌ vite binary not found in node_modules/.bin. Failing build."
              exit 1
            fi

            echo "🚀 Building with Vite..."
            ./node_modules/.bin/vite build
          '
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
EOF

  environment_variables = {
    NODE_ENV = "production"
  }
}

resource "aws_amplify_branch" "main_branch" {
  app_id            = aws_amplify_app.animus_app.id
  branch_name       = "main"
  enable_auto_build = true
}
