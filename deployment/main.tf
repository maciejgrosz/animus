resource "aws_amplify_app" "animus_app" {
  name       = "animus"
  repository = "https://github.com/maciejgrosz/animus"

  build_spec = <<EOF
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "📥 Installing NVM..."
        - curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
        - export NVM_DIR=$HOME/.nvm
        - source $NVM_DIR/nvm.sh
        - nvm install 20
        - nvm use 20
        - echo "🛠️ Node version: $(node -v)"
        - echo "📦 NPM version: $(npm -v)"
        - echo "📦 Installing dependencies..."
        - npm install
        - "echo 📄 package.json: && cat package.json"
        - echo "🏗️ Running build..."
        - npm run build
        - echo "📂 Listing node_modules/.bin:"
        - ls -l ./node_modules/.bin
    build:
      commands:
        - |
          bash -c '
            set -e
            export NVM_DIR=$HOME/.nvm
            source $NVM_DIR/nvm.sh
            nvm use 20

            echo "🛠️ Using Node version: \$(node -v)"
            echo "📦 Using NPM version: \$(npm -v)"
            echo "📂 Listing node_modules/.bin:"
            ls -l ./node_modules/.bin

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



# Create a branch for automatic deployments
resource "aws_amplify_branch" "main_branch" {
  app_id      = aws_amplify_app.animus_app.id
  branch_name = "main"
  enable_auto_build = true
}

