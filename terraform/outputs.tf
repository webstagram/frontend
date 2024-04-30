output "s3_endpoint" {
  value = aws_s3_bucket_website_configuration.app.website_endpoint
}