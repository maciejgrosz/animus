resource "aws_amplify_app" "animus_app" {
  name       = "animus"
  repository = "https://github.com/maciejgrosz/animus"

  build_spec = <<EOF
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - bash -c '
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash &&
            export NVM_DIR=$HOME/.nvm &&
            source $NVM_DIR/nvm.sh &&
            nvm install 20 &&
            nvm use 20 &&
            node -v &&
            npm -v &&
            npm ci
          '
    build:
      commands:
        - bash -c '
            export NVM_DIR=$HOME/.nvm &&
            source $NVM_DIR/nvm.sh &&
            nvm use 20 &&
            npm run build
          '
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
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

