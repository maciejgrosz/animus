resource "aws_amplify_app" "animus_app" {
  name                = "animus"
  repository          = "https://github.com/maciejgrosz/animus"  # Replace with your GitHub repo URL
  build_spec          = <<EOF
version: 1
applications:
  - app_root: /
    frontend:
      phases:
        build:
          commands:
            - npm install
            - npm run build
      artifacts:
        base_directory: /dist
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
#
# # Output Amplify App ARN (ID) and URL
# output "amplify_app_arn" {
#   description = "The ARN of the Amplify app"
#   value       = aws_amplify_app.animus_app.app_arn   # Corrected to app_arn
# }
#
# output "amplify_app_url" {
#   description = "The URL of the Amplify app"
#   value       = "https://${aws_amplify_app.animus_app.name}.amplifyapp.com"  # Construct URL manually
# }
