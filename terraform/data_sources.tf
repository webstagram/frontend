data "aws_iam_policy_document" "bucket-policy" {
  statement {
    sid    = "AllowPublicRead"
    effect = "Allow"
    resources = [
      aws_s3_bucket.app.arn,
      "arn:aws:s3:::${aws_s3_bucket.app.bucket}/*",
    ]
    actions = ["S3:GetObject"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}