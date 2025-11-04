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

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: filename,
      Body: avifBuffer,
      ContentType: "image/avif",
    })

    await s3Client.send(uploadCommand)

    // Generate public URL
    const url = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${filename}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}
