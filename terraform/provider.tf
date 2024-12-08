provider "aws" {
  region                      = var.aws_region
  access_key                  = "gwen"
  secret_key                  = "stacy"

  skip_credentials_validation = var.STAGE == "local"
  skip_metadata_api_check     = var.STAGE == "local"
  skip_requesting_account_id  = var.STAGE == "local"

  endpoints {
    apigateway       = var.STAGE == "local" ? "http://localhost:4566" : null
    cloudformation   = var.STAGE == "local" ? "http://localhost:4566" : null
    cloudwatch       = var.STAGE == "local" ? "http://localhost:4566" : null
    cloudwatchevents = var.STAGE == "local" ? "http://localhost:4566" : null
    iam              = var.STAGE == "local" ? "http://localhost:4566" : null
    lambda           = var.STAGE == "local" ? "http://localhost:4566" : null
    s3               = var.STAGE == "local" ? "http://localhost:4566" : null
  }
}