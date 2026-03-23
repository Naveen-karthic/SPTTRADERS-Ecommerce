# Troubleshooting Guide - Common Issues & Solutions

This guide covers common issues you may encounter while setting up or running the authentication system.

---

## Issue: "Network error. Please try again."

### Problem
When attempting to register or login, you see a "Network error" message.

### Root Cause
This error occurs when the frontend cannot connect to the backend API server. This usually means:
1. Backend server is not running
2. Backend server crashed due to an error
3. Wrong API URL in frontend configuration

### Solutions

#### 1. Check if Backend is Running

**Check backend status:**
```bash
curl http://localhost:5001/
```

**Expected response:**
```
SPT Traders E-Commerce API is running...
```

**If connection refused:** Backend is not running. See solution #2.

#### 2. Start Backend Server

```bash
cd backend
npm run dev
```

**Expected output:**
```
Server is running on port 5001
MongoDB connected
```

#### 3. Check for Backend Errors

If backend crashes on startup, check the error message:

**Common Error: "argument handler must be a function"**
```
TypeError: argument handler must be a function
    at Route.<computed> [as get]
```

**Solution:**
This error was fixed in the latest version. Ensure your `authRoutes.js` imports middleware correctly:

```javascript
// ❌ Wrong (causes error)
const { authenticate } = require('../middleware/auth');

// ✅ Correct
const authenticate = require('../middleware/auth');
```

**File:** `backend/src/routes/authRoutes.js`

#### 4. Verify Frontend Configuration

Check `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

**Important:** The URL must match the backend port (default: 5001)

#### 5. Test API Endpoint Manually

```bash
# Test registration endpoint
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phoneNumber":"1234567890"}'
```

**Expected response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "phoneNumber": "1234567890"
  }
}
```

---

## Issue: Frontend Won't Start - Rollup Error

### Problem
```
Error: Cannot find module @rollup/rollup-linux-x64-gnu
```

### Solution

Install the missing rollup module:

```bash
cd frontend
npm install @rollup/rollup-linux-x64-gnu --save-dev
```

Then start the frontend:
```bash
npm run dev
```

---

## Issue: OTP Not Received in Email

### Problem
You request an OTP but don't receive an email.

### Solutions

#### 1. Check Backend Configuration

Verify `backend/.env` has correct email settings:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

#### 2. Get Gmail App Password

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable **2-Factor Authentication**
3. Go to **Security → App Passwords**
4. Generate a new app password (select "Mail" and your device)
5. Copy and paste into `EMAIL_PASS`

**Note:** Your regular Gmail password won't work. You must use an App Password.

#### 3. Check Spam Folder

OTP emails sometimes go to spam. Check your spam/junk folder.

#### 4. Verify Email Service

Check backend console for email logs:
```
OTP email sent to user@example.com
Welcome email sent to user@example.com
```

If you see errors, check:
- Internet connection
- Gmail credentials
- Firewall settings

---

## Issue: "MongoDB connection error"

### Problem
Backend shows: "MongoDB connection error"

### Solutions

#### 1. Check if MongoDB is Running

```bash
# Linux/Mac
sudo systemctl status mongod

# Or check process
ps aux | grep mongod
```

#### 2. Start MongoDB

```bash
# Linux
sudo systemctl start mongod

# Mac
brew services start mongodb-community

# Windows
net start MongoDB
```

#### 3. Verify Connection String

Check `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/spt-traders
```

Default MongoDB port is **27017**. Ensure it matches your MongoDB setup.

---

## Issue: "Invalid or expired OTP"

### Problem
You enter the OTP but get "Invalid or expired OTP" error.

### Solutions

#### 1. Check OTP Expiration

OTPs expire after **10 minutes**. If too much time has passed, request a new OTP.

#### 2. Enter Complete OTP

Ensure you enter all **6 digits** of the OTP.

#### 3. Check for Typos

OTP is case-sensitive and numbers only. Example: `123456`

#### 4. Verify Correct Email

Ensure you're using the same email address that received the OTP.

---

## Issue: CORS Error in Browser

### Problem
Browser console shows:
```
Access to XMLHttpRequest at 'http://localhost:5001/api/auth/register'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

### Solution

Ensure CORS is configured in `backend/src/server.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

For development, you can use:
```javascript
app.use(cors()); // Allows all origins (dev only!)
```

---

## Issue: User Already Exists

### Problem
Registration shows: "User with this email already exists"

### Solution

This is expected behavior. Email addresses must be unique.

**To test with a new user:**
1. Use a different email address
2. Or delete the existing user from database

**Delete user from MongoDB:**
```bash
mongosh
use spt-traders
db.users.deleteOne({email: "test@example.com"})
```

---

## Issue: Port Already in Use

### Problem
```
Error: listen EADDRINUSE: address already in use :::5001
```

### Solutions

#### 1. Kill Process Using Port

```bash
# Find process
lsof -i :5001

# Kill it (replace PID with actual process ID)
kill -9 <PID>
```

#### 2. Use Different Port

Change `PORT` in `backend/.env`:
```env
PORT=5002
```

Don't forget to update `frontend/.env`:
```env
VITE_API_URL=http://localhost:5002/api
```

---

## Issue: Token Not Stored After Login

### Problem
After successful login, you're redirected but not logged in.

### Solutions

#### 1. Check Browser Console

Open DevTools (F12) → Console tab and look for errors.

#### 2. Verify localStorage

In browser console:
```javascript
localStorage.getItem('token')
localStorage.getItem('user')
```

Both should return a value (not null).

#### 3. Check Auth Context

Ensure your app is wrapped with `AuthProvider`:

```jsx
// App.tsx
<AuthProvider>
  <AppContent />
</AuthProvider>
```

---

## Quick Health Check

Run these commands to verify everything is working:

```bash
# 1. Check backend
curl http://localhost:5001/

# 2. Check MongoDB
mongosh --eval "db.adminCommand('ping')"

# 3. Test registration
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phoneNumber":"1234567890"}'

# 4. Check frontend (should show Vite output)
curl http://localhost:5173/
```

---

## Getting Help

If issues persist:

1. **Check logs:**
   - Backend console for server errors
   - Browser console (F12) for frontend errors
   - Network tab for failed requests

2. **Verify configurations:**
   - `.env` files in both frontend and backend
   - MongoDB connection
   - Email credentials

3. **Restart everything:**
   ```bash
   # Kill all processes
   pkill -f "node.*server.js"
   pkill -f "vite"

   # Start fresh
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

---

**Last Updated:** March 2025
