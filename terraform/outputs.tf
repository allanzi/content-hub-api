# Test API Gateway URL
output "api_gateway_id" {
  value = aws_api_gateway_deployment.example.rest_api_id
}

output "api_gateway_url" {
  value = aws_api_gateway_deployment.example.invoke_url
}