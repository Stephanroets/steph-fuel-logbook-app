import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3Client, S3_BUCKET_NAME } from "@/lib/aws/s3-client"
import sharp from "sharp"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (
      !process.env.AWS_REGION ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_S3_BUCKET_NAME
    ) {
      console.error("[v0] Missing AWS environment variables")
      return NextResponse.json(
        {
          error:
            "AWS configuration incomplete. Please check your environment variables in the Vars section of the sidebar.",
        },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Convert image to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Convert to AVIF format using sharp
    const avifBuffer = await sharp(buffer).avif({ quality: 80 }).toBuffer()

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `receipts/${user.id}/${timestamp}.avif`

    try {
      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: filename,
        Body: avifBuffer,
        ContentType: "image/avif",
      })

      await s3Client.send(uploadCommand)
    } catch (s3Error) {
      console.error("[v0] S3 upload error:", s3Error)
      return NextResponse.json(
        {
          error: "Failed to upload to S3. Please verify your AWS credentials and bucket configuration.",
        },
        { status: 500 },
      )
    }

    // Generate public URL
    const url = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}
