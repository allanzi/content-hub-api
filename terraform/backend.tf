terraform {
  backend "s3" {
    bucket = "content-hub-api-lambda-terraform-state"
    region = "us-east-1"
    key    = "API-Gateway/terraform.tfstate"
  }
  required_version = ">= 0.13.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 2.7.0"
    }
  }
}