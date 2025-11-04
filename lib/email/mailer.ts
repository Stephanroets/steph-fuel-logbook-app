import nodemailer from "nodemailer"

export async function sendEmail(to: string, subject: string, html: string) {
  // Create transporter using SMTP settings
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  // Send email
  const info = await transporter.sendMail({
    from: `"FuelLog" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
  })

  return info
}
