resource "aws_amplify_app" "animus_app" {
  name       = "animus"
  repository = "https://github.com/maciejgrosz/animus"

  build_spec = <<EOF
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - export NVM_DIR="$HOME/.nvm"
        - nvm install 20
        - nvm use 20
        - echo "📦 Installing all dependencies including Vite..."
        - NODE_ENV= npm ci
    build:
      commands:
        - echo "🚀 Running Vite build..."
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  appRoot: .
EOF

  environment_variables = {
    NODE_ENV = "production"
  }

  # custom_rule {
  #   source = "/<*>"
  #   target = "/index.html"
  #   status = "200"
  # }
}

resource "aws_amplify_branch" "main_branch" {
  app_id            = aws_amplify_app.animus_app.id
  branch_name       = "main"
  enable_auto_build = true
}
