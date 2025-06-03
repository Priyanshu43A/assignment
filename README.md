# Node.js Authentication System

A secure and scalable authentication system built with Node.js, Express, and MongoDB.

## Features

- User registration with email verification
- Secure password hashing
- JWT-based authentication
- Refresh token mechanism
- Rate limiting
- Account locking after failed attempts
- Account deactivation/reactivation
- Email verification with OTP
- Comprehensive error handling
- Security best practices
- Ethereal email testing in development

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- SMTP server for email functionality (production only)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

For development:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
NODE_ENV=development
```

For production:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@yourdomain.com
NODE_ENV=production
```

4. Start the server:

```bash
npm start
```

## Email Testing in Development

The system uses Ethereal Email for testing email functionality in development mode. When `NODE_ENV` is set to "development":

1. A test Ethereal account is automatically created
2. All emails are sent to this test account
3. No actual emails are delivered
4. Preview URLs are logged to the console for viewing test emails
5. You can view the test emails at the provided Ethereal preview URL

To view test emails:

1. Check the console logs for the Ethereal preview URL
2. Click the URL to open the Ethereal web interface
3. View the email content and verify the OTP

## API Documentation

### Authentication Endpoints

#### 1. Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### 2. Email Verification

```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### 3. Resend Verification OTP

```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### 4. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### 5. Refresh Token

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### 6. Deactivate Account

```http
POST /api/auth/deactivate
Authorization: Bearer your_access_token
```

#### 7. Reactivate Account

```http
POST /api/auth/reactivate
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

## Security Features

### Rate Limiting

- General API: 100 requests per 15 minutes
- Auth routes: 5 attempts per hour
- OTP requests: 3 attempts per hour

### Account Security

- Password requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- Account locking after 5 failed login attempts
- 2-hour lock duration
- Email verification required for login
- JWT token expiration (1 hour for access token, 7 days for refresh token)

### Error Handling

- Detailed error messages in development
- Sanitized error messages in production
- Proper HTTP status codes
- Consistent response format

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {
    // Response data (if any)
  },
  "error": "Error details (development only)"
}
```

## Error Codes

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Security Best Practices

1. Always use HTTPS in production
2. Keep dependencies updated
3. Use environment variables for sensitive data
4. Implement proper CORS policies
5. Use secure headers
6. Implement rate limiting
7. Use secure password hashing
8. Implement proper session management
9. Use secure cookie settings
10. Implement proper error handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
