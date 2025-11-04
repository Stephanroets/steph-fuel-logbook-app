# AWS S3 and SES Setup Guide

This guide will walk you through setting up AWS S3 for receipt storage and AWS SES for email functionality using the AWS IAM Dashboard.

## Prerequisites

- An AWS account
- Access to the AWS Management Console

--- 

## Part 1: Setting Up AWS S3 Bucket for Receipt Storage

### Step 1: Create an S3 Bucket

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/)
2. Navigate to **S3** service (search for "S3" in the top search bar)
3. Click **Create bucket**
4. Configure your bucket:
   - **Bucket name**: `fuel-logbook-receispts-2` (must be globally unique, add your own suffix if needed)
   - **AWS Region**: Choose your preferred region (e.g., `us-east-1`)
   - **Object Ownership**: Select "ACLs disabled (recommended)"
   - **Block Public Access settings**: 
     - Uncheck "Block all public access"
     - Check the acknowledgment box
   - Leave other settings as default
5. Click **Create bucket**

### Step 2: Configure Bucket Policy for Public Read Access

1. Click on your newly created bucket name
2. Go to the **Permissions** tab
3. Scroll down to **Bucket policy** and click **Edit**
4. Paste the following policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
\`\`\`

5. Click **Save changes**

### Step 3: Enable CORS (Cross-Origin Resource Sharing)

1. Still in the **Permissions** tab, scroll to **Cross-origin resource sharing (CORS)**
2. Click **Edit**
3. Paste the following CORS configuration:

\`\`\`json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
\`\`\`

4. Click **Save changes**

---

## Part 2: Creating IAM User with S3 Access

### Step 1: Create IAM User

1. Navigate to **IAM** service (search for "IAM" in the top search bar)
2. Click **Users** in the left sidebar
3. Click **Create user**
4. Enter a username: `fuel-logbook-s3-user`
5. Click **Next**

### Step 2: Attach Permissions

1. Select **Attach policies directly**
2. Search for and select **AmazonS3FullAccess** (or create a custom policy for more security)
3. Click **Next**
4. Review and click **Create user**

### Step 3: Create Access Keys

1. Click on the newly created user
2. Go to the **Security credentials** tab
3. Scroll down to **Access keys** section
4. Click **Create access key**
5. Select **Application running outside AWS**
6. Click **Next**
7. Add a description tag (optional): "FuelLog App S3 Access"
8. Click **Create access key**
9. **IMPORTANT**: Copy both the **Access key ID** and **Secret access key** immediately
   - You won't be able to see the secret key again
   - Store them securely

### Step 4: Add Environment Variables to Your Project

Add these environment variables to your Vercel project or `.env.local` file:

\`\`\`env
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=fuel-logbook-receipts
\`\`\`

---

## Part 3: Setting Up AWS SES for Email

### Step 1: Navigate to SES

1. In the AWS Console, search for **SES** (Simple Email Service)
2. Select your preferred region (must be a region that supports SES)
   - Recommended: `us-east-1`, `us-west-2`, or `eu-west-1`

### Step 2: Verify Your Email Address

1. In the SES dashboard, click **Verified identities** in the left sidebar
2. Click **Create identity**
3. Select **Email address**
4. Enter your email address (the one you'll use to send emails)
5. Click **Create identity**
6. Check your email inbox for a verification email from AWS
7. Click the verification link in the email

### Step 3: Request Production Access (Optional but Recommended)

By default, SES is in "sandbox mode" which limits who you can send emails to.

1. In the SES dashboard, click **Account dashboard** in the left sidebar
2. Look for the banner about sandbox mode
3. Click **Request production access**
4. Fill out the form:
   - **Mail type**: Transactional
   - **Website URL**: Your app's URL
   - **Use case description**: "Sending fuel logbook reports to registered users"
   - **Compliance**: Confirm you'll only send to users who requested it
5. Submit the request (approval usually takes 24-48 hours)

### Step 4: Create SMTP Credentials

1. In the SES dashboard, click **SMTP settings** in the left sidebar
2. Click **Create SMTP credentials**
3. Enter an IAM user name: `fuel-logbook-ses-smtp`
4. Click **Create user**
5. **IMPORTANT**: Download or copy the SMTP credentials:
   - **SMTP Username**
   - **SMTP Password**
   - **SMTP Endpoint** (e.g., `email-smtp.us-east-1.amazonaws.com`)
   - **Port**: Use 587 (TLS) or 465 (SSL)

### Step 5: Add SES Environment Variables

Add these to your Vercel project or `.env.local` file:

\`\`\`env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_smtp_username_here
SMTP_PASSWORD=your_smtp_password_here
SMTP_FROM_EMAIL=your_verified_email@example.com
\`\`\`

---

## Part 4: Configuring Supabase with Custom SMTP

### Step 1: Access Supabase Dashboard

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Click **Settings** in the left sidebar
4. Click **Auth** under Settings

### Step 2: Configure SMTP Settings

1. Scroll down to **SMTP Settings**
2. Enable **Enable Custom SMTP**
3. Fill in the following:
   - **Host**: `email-smtp.us-east-1.amazonaws.com` (your SES SMTP endpoint)
   - **Port**: `587`
   - **Username**: Your SMTP username from Step 4
   - **Password**: Your SMTP password from Step 4
   - **Sender email**: Your verified email address
   - **Sender name**: `FuelLog` (or your preferred name)
4. Click **Save**

### Step 3: Test Email Configuration

1. Try signing up a new user in your app
2. Check if the confirmation email is received
3. If not received, check:
   - Spam folder
   - SES sending statistics in AWS Console
   - Supabase logs for errors

---

## Security Best Practices

1. **Never commit credentials to Git**: Always use environment variables
2. **Use IAM policies with least privilege**: Create custom policies that only grant necessary permissions
3. **Rotate access keys regularly**: Change your AWS access keys every 90 days
4. **Enable MFA on your AWS account**: Add an extra layer of security
5. **Monitor S3 bucket access**: Set up CloudWatch alarms for unusual activity
6. **Use SES sending limits**: Configure daily sending quotas to prevent abuse

---

## Troubleshooting

### S3 Upload Fails

- Check that your IAM user has `s3:PutObject` permission
- Verify the bucket name in your environment variables
- Ensure CORS is properly configured

### Emails Not Sending

- Verify your email address in SES
- Check if you're still in sandbox mode (can only send to verified addresses)
- Verify SMTP credentials are correct
- Check Supabase logs for detailed error messages

### Access Denied Errors

- Verify IAM user permissions
- Check bucket policy allows public read access
- Ensure access keys are correctly set in environment variables

---

## Cost Considerations

- **S3 Storage**: First 50 TB/month costs $0.023 per GB
- **S3 Requests**: PUT requests cost $0.005 per 1,000 requests
- **SES**: First 62,000 emails per month are free (when sending from EC2)
- **SES (outside EC2)**: $0.10 per 1,000 emails

For a typical fuel logbook app with moderate usage, monthly costs should be under $5.

---

## Next Steps

After completing this setup:

1. Test receipt upload functionality in your app
2. Test email sending for logbook exports
3. Monitor AWS costs in the Billing Dashboard
4. Set up CloudWatch alarms for unusual activity
5. Consider implementing image optimization to reduce storage costs
