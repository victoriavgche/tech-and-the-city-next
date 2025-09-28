# Contact Form Setup Instructions

## Email Configuration

To make the contact form work, you need to set up email configuration:

### 1. Create Gmail App Password

1. Go to your Google Account settings
2. Enable 2-factor authentication if not already enabled
3. Go to "Security" → "App passwords"
4. Generate a new App Password for "Mail"
5. Copy the generated password

### 2. Set Environment Variables

Create a `.env.local` file in the project root with:

```
EMAIL_USER=techandthecity101@gmail.com
EMAIL_PASS=your_generated_app_password_here
```

Replace `your_generated_app_password_here` with the App Password you generated in step 1.

### 3. How it Works

- When someone fills out the contact form, it sends an email to `techandthecity101@gmail.com`
- The email includes the sender's name, email, subject, and message
- The sender's email is included so you can reply directly

### 4. Features

- ✅ Validates all required fields
- ✅ Sends formatted HTML email
- ✅ Includes sender's contact info for easy reply
- ✅ Error handling and user feedback
- ✅ Professional email template

The contact form is now ready to use once you set up the environment variables!
