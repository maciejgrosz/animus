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

            echo "📦 Installing dependencies using npm ci..."
            npm ci

            echo "📄 package.json content:"
            cat package.json

            echo "📂 Checking Vite in node_modules/.bin:"
            ls -l ./node_modules/.bin || true
            echo "📍 npm list vite:"
            npm ls vite || true
          '
    build:
      commands:
        - |
          bash -c '
            set -e
            export NVM_DIR=$HOME/.nvm
            source $NVM_DIR/nvm.sh
            nvm use 20

            echo "🛠️ Node version: $(node -v)"
            echo "📦 NPM version: $(npm -v)"
            echo "📂 node_modules/.bin content:"
            ls -l ./node_modules/.bin || true

            if [ ! -f ./node_modules/.bin/vite ]; then
              echo "❌ Vite binary not found. Aborting build."
              exit 1
            fi

            echo "🚀 Building with Vite..."
            npm run build
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
