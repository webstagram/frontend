variable "common_tags" {
  type        = map(string)
  description = "Common tags applied to all resources"
}

variable "region" {
  type        = string
  description = "The region where the resources will be deployed."
}

variable "cors_allowed_origins" {
  type        = list(string)
  description = "The domains allowed in the CORS configuration."
}

variable "bucket_name" {
  type        = string
  description = "Name of the bucket."
}