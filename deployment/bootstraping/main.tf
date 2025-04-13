# Create an IAM Role for Terraform to manage S3 and DynamoDB access
resource "aws_iam_role" "terraform_role" {
  name = "terraform-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = {
          AWS = "arn:aws:iam::058264512386:user/admin"
        }
        Action   = "sts:AssumeRole"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "terraform_role_policy" {
  role       = aws_iam_role.terraform_role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_s3_bucket" "terraform_state_bucket" {
  bucket = "tf-animus-statefile-123"
}

resource "aws_s3_bucket_versioning" "terraform_state_bucket_versioning" {
  bucket = aws_s3_bucket.terraform_state_bucket.bucket

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state_bucket_public_access_block" {
  bucket = aws_s3_bucket.terraform_state_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Create DynamoDB table for state locking
resource "aws_dynamodb_table" "terraform_lock_table" {
  name           = "terraform-lock-table"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}

# Outputs
output "terraform_role_arn" {
  value = aws_iam_role.terraform_role.arn
}

output "terraform_state_bucket_name" {
  value = aws_s3_bucket.terraform_state_bucket.bucket
}

output "terraform_lock_table_name" {
  value = aws_dynamodb_table.terraform_lock_table.name
}
