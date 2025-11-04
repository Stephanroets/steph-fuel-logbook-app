import { S3Client } from "@aws-sdk/client-s3"

const AWS_REGION = process.env.AWS_REGION
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME

// Validate environment variables
if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET_NAME) {
  console.error("[v0] Missing AWS environment variables:", {
    AWS_REGION: AWS_REGION ? "✓" : "✗",
    AWS_ACCESS_KEY_ID: AWS_ACCESS_KEY_ID ? "✓" : "✗",
    AWS_SECRET_ACCESS_KEY: AWS_SECRET_ACCESS_KEY ? "✓" : "✗",
    AWS_S3_BUCKET_NAME: AWS_S3_BUCKET_NAME ? "✓" : "✗",
  })
}

// Create S3 client with validated credentials
export const s3Client = new S3Client({
  region: AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || "",
    secretAccessKey: AWS_SECRET_ACCESS_KEY || "",
  },
})

export const S3_BUCKET_NAME = AWS_S3_BUCKET_NAME || "fuel-logbook-receipts"
