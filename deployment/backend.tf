provider "aws" {
  region = "eu-west-1"

  default_tags {
    tags = {
      terraform = "true"
      project   = "animus"
    }
  }
}

terraform {
  backend "s3" {
    bucket         = "tf-animus-statefile-123"
    region         = "eu-west-1"
    encrypt        = true
    acl            = "private"
    dynamodb_table = "terraform-lock-table"
    key            = "animus/terraform.tfstate"
  }
}
