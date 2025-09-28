# Email Setup Instructions

## Gmail App Password Setup

To enable email notifications for contact form submissions, you need to set up a Gmail App Password:

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password
1. In Google Account settings, go to Security > App passwords
2. Select "Mail" as the app
3. Generate a new app password
4. Copy the generated password (it will look like: abcd efgh ijkl mnop)

### Step 3: Create Environment File
Create a file named `.env.local` in the project root with:

```
EMAIL_USER=techandthecity101@gmail.com
EMAIL_PASS=your_generated_app_password_here
```

### Step 4: Test Email Functionality
1. Restart the development server
2. Submit a test message through the contact form
3. Check your email inbox for the notification

## Email Features

- **Automatic notifications** when someone submits the contact form
- **Rich HTML formatting** with contact details and message
- **Reply functionality** - you can reply directly to the email
- **Fallback handling** - if email fails, the message is still saved

## Troubleshooting

If emails are not being sent:
1. Check that .env.local file exists and has correct credentials
2. Verify the app password is correct
3. Check server console for error messages
4. Ensure 2FA is enabled on the Gmail account
