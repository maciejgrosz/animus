resource "aws_amplify_app" "animus_app" {
  name                = "animus"
  repository          = "https://github.com/maciejgrosz/animus"  # Replace with your GitHub repo URL
  build_spec          = <<EOF
  version: 1
  frontend:
    phases:
      preBuild:
        commands:
          - nvm install 20
          - nvm use 20
          - npm ci
      build:
        commands:
          - npm run build
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

