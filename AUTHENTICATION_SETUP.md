# User Authentication System - Complete Documentation

This document provides comprehensive information about the user authentication system implemented for the SPT Traders e-commerce application.

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [API Endpoints](#api-endpoints)
7. [Database Schema](#database-schema)
8. [Email Configuration](#email-configuration)
9. [Usage Flow](#usage-flow)
10. [Security Considerations](#security-considerations)

---

## Overview

The authentication system provides a secure, OTP-based login mechanism with user registration. It uses JWT tokens for maintaining session state and Nodemailer for sending OTP emails.

### Key Features:
- **OTP-Based Authentication**: 6-digit OTP sent via email
- **User Registration**: Name, email, and phone number collection
- **JWT Token Management**: 7-day token expiration
- **Email Verification**: Automated OTP and welcome emails
- **Protected Routes**: Middleware for securing API endpoints
- **Responsive UI**: Beautiful React components with animations

---

## Features

### User Registration
- Collect name, email, and phone number
- Email uniqueness validation
- Phone number format validation
- Welcome email on successful registration
- Auto-login after registration

### Login Process
1. Enter email address
2. Receive 6-digit OTP via email
3. Verify OTP
4. Generate JWT token
5. Redirect to dashboard

### OTP Features
- 6-digit numeric code
- 10-minute expiration
- Resend OTP functionality
- Auto-focus and paste support
- Countdown timer display

---

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for token generation
- **Nodemailer** for email sending
- **bcryptjs** for password hashing (if needed in future)

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **Framer Motion** for animations
- **Lucide React** for icons
- **Tailwind CSS** for styling

---

## Backend Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Gmail account with App Password

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**

Create/edit `.env` file:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/spt-traders
JWT_SECRET=your-super-secret-jwt-key-change-this
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

4. **Get Gmail App Password:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Enable 2-Factor Authentication
   - Go to Security → App Passwords
   - Generate a new app password
   - Copy and use it in `EMAIL_PASS`

5. **Start the server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5001`

---

## Frontend Setup

### Installation

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**

Create/edit `.env` file:
```env
VITE_API_URL=http://localhost:5001/api
```

4. **Start the development server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another available port)

---

## API Endpoints

### Public Routes

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "1234567890"
}
```

**Response (201):**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "1234567890"
  }
}
```

#### 2. Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "OTP sent to your email"
}
```

#### 3. Verify OTP & Login
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "1234567890",
    "role": "user"
  }
}
```

### Protected Routes

#### 4. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "1234567890",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phoneNumber: String (required),
  address: String (optional),
  role: String (enum: ['user', 'admin'], default: 'user'),
  otp: String (optional),
  otpExpires: Date (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Index:**
- `email` field is indexed for uniqueness and faster lookups

---

## Email Configuration

### Email Service Location
`backend/src/utils/emailService.js`

### Functions

#### 1. sendOTPEmail(email, otp, name)
Sends 6-digit OTP to user's email with:
- Professional HTML template
- Company branding
- Clear OTP display
- Expiration information

#### 2. sendWelcomeEmail(email, name)
Sends welcome email after registration with:
- Welcome message
- Feature highlights
- Contact information

### Email Templates

Emails are sent using HTML templates with:
- Responsive design
- SPT Traders branding
- Clear call-to-actions
- Professional styling

---

## Usage Flow

### Registration Flow

```
User → Signup Page
  ↓
Enter: Name, Email, Phone Number
  ↓
Submit Form
  ↓
Backend: Validate & Create User
  ↓
Send Welcome Email
  ↓
Auto-login (Generate JWT Token)
  ↓
Store Token in localStorage
  ↓
Redirect to Home/Dashboard
```

### Login Flow

```
User → Login Page
  ↓
Enter: Email
  ↓
Submit
  ↓
Backend: Generate 6-digit OTP
  ↓
Send OTP via Email
  ↓
User → OTP Verification Page
  ↓
Enter: 6-digit OTP
  ↓
Submit
  ↓
Backend: Verify OTP
  ↓
Generate JWT Token
  ↓
Store Token in localStorage
  ↓
Redirect to Home/Dashboard
```

### Logout Flow

```
User → Click Logout Button
  ↓
Clear Token from localStorage
  ↓
Clear User Data from localStorage
  ↓
Update Auth Context
  ↓
Redirect to Home/Login Page
```

---

## Security Considerations

### Implemented Security Measures

1. **JWT Tokens**
   - Secret key stored in environment variables
   - 7-day expiration
   - Contains user ID and role

2. **OTP Security**
   - 6-digit random numeric code
   - 10-minute expiration
   - Single-use only
   - Stored hashed in database (recommended enhancement)

3. **Input Validation**
   - Email format validation (frontend & backend)
   - Phone number format validation
   - Required field checks
   - SQL injection prevention (using MongoDB)

4. **CORS Configuration**
   - Configured in Express
   - Restrict to specific domains in production

5. **Environment Variables**
   - Sensitive data stored in `.env`
   - Never committed to version control

### Recommended Enhancements

1. **Rate Limiting**
   - Implement rate limiting on OTP endpoints
   - Prevent brute force attacks

2. **OTP Hashing**
   - Hash OTPs before storing in database
   - Use bcrypt or similar

3. **Password Recovery**
   - Implement forgot password flow
   - Security questions or email verification

4. **Session Management**
   - Implement refresh tokens
   - Token rotation on sensitive actions

5. **HTTPS**
   - Use HTTPS in production
   - Secure cookie attributes

6. **CSRF Protection**
   - Implement CSRF tokens
   - Validate on state-changing operations

---

## Frontend Components

### Pages

1. **SignupPage** (`/signup`)
   - User registration form
   - Real-time validation
   - Success animation

2. **LoginPageNew** (`/login`)
   - Email input for OTP
   - Transition to OTP verification

3. **OTPVerificationPage**
   - 6-digit OTP input
   - Countdown timer
   - Resend OTP functionality
   - Auto-focus management

### Context & Services

1. **AuthContext** (`contexts/AuthContext.tsx`)
   - Global authentication state
   - Login/logout functions
   - Token management

2. **authService** (`services/authService.ts`)
   - API calls for authentication
   - Error handling
   - Type-safe responses

---

## Testing the System

### Manual Testing Steps

1. **Test Registration:**
   - Navigate to `/signup`
   - Enter valid name, email, phone
   - Submit form
   - Verify welcome email received
   - Verify redirect to home

2. **Test Login:**
   - Navigate to `/login`
   - Enter registered email
   - Check email for OTP
   - Enter OTP in verification page
   - Verify successful login

3. **Test OTP Expiration:**
   - Request OTP
   - Wait 10 minutes
   - Try to verify expired OTP
   - Verify error message

4. **Test Invalid OTP:**
   - Request OTP
   - Enter wrong OTP
   - Verify error message

5. **Test Logout:**
   - Login successfully
   - Click logout button
   - Verify redirect
   - Verify localStorage cleared

---

## Troubleshooting

### Common Issues

1. **OTP Not Received**
   - Check Gmail App Password
   - Check spam folder
   - Verify email configuration in `.env`
   - Check backend console for errors

2. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure MongoDB is on port 27017

3. **CORS Errors**
   - Verify CORS configuration in backend
   - Check API_URL in frontend `.env`

4. **JWT Verification Failed**
   - Verify JWT_SECRET matches
   - Check token expiration
   - Verify token format in Authorization header

---

## Production Deployment Checklist

- [ ] Change JWT_SECRET to a strong, random value
- [ ] Configure production MongoDB URI
- [ ] Use HTTPS for all endpoints
- [ ] Set up production email service
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting
- [ ] Set up logging and monitoring
- [ ] Implement proper error handling
- [ ] Add request validation
- [ ] Set up database backups
- [ ] Configure environment-specific variables
- [ ] Test complete flow in production environment

---

## File Structure

### Backend
```
backend/
├── src/
│   ├── controllers/
│   │   └── authController.js       # Auth logic
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   ├── models/
│   │   └── User.js                  # User schema
│   ├── routes/
│   │   └── authRoutes.js            # API routes
│   ├── utils/
│   │   └── emailService.js          # Email sending
│   └── server.js                    # Express setup
├── .env                              # Environment variables
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx          # Auth state management
│   ├── pages/
│   │   ├── SignupPage.tsx           # Registration page
│   │   ├── LoginNewPage.tsx         # Login wrapper
│   │   ├── LoginPageNew.tsx         # Email input
│   │   └── OTPVerificationPage.tsx  # OTP verification
│   ├── services/
│   │   └── authService.ts           # API calls
│   ├── types/
│   │   └── auth.ts                  # TypeScript types
│   ├── components/
│   │   └── Navbar.tsx               # Updated with auth
│   └── App.tsx                      # Routing setup
├── .env                              # Environment variables
└── package.json
```

---

## Support & Maintenance

For issues or questions:
1. Check the troubleshooting section
2. Review console logs for errors
3. Verify environment configurations
4. Check API responses in browser DevTools

---

**Last Updated:** March 2025
**Version:** 1.0.0
