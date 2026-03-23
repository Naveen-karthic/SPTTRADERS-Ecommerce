# Quick Start Guide - Authentication System

## 🚀 Setup in 5 Minutes

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment (.env)**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/spt-traders
JWT_SECRET=change-this-to-a-secure-random-string
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

3. **Start Backend Server**
```bash
npm run dev
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment (.env)**
```env
VITE_API_URL=http://localhost:5001/api
```

3. **Start Frontend Server**
```bash
npm run dev
```

---

## 📍 Key Routes

### Frontend Pages
- `/signup` - User Registration
- `/login` - Login (Email input → OTP verification)
- `/` - Home/Dashboard (after login)

### Backend API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP & login
- `GET /api/auth/me` - Get current user (protected)

---

## 🎯 How to Use

### 1. Register New User
```
Go to: http://localhost:5173/signup
Fill in: Name, Email, Phone Number
Submit → Welcome email → Auto-login → Redirect to home
```

### 2. Login
```
Go to: http://localhost:5173/login
Enter: Email address
Submit → Check email for 6-digit OTP
Enter OTP → Verify → Login successful → Redirect to home
```

### 3. Access Protected Routes
```typescript
// In your components
import { useAuth } from './contexts/AuthContext';

const { user, token, isAuthenticated } = useAuth();

// Make authenticated requests
axios.get('/api/protected', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

---

## ✨ Features Included

### Backend ✓
- [x] User registration with validation
- [x] 6-digit OTP generation
- [x] OTP email sending with HTML templates
- [x] OTP verification with expiration
- [x] JWT token generation
- [x] Protected route middleware
- [x] Welcome email on registration

### Frontend ✓
- [x] Beautiful signup form with validation
- [x] Login page with email input
- [x] OTP verification page with:
  - 6-digit input with auto-focus
  - Countdown timer (10 minutes)
  - Resend OTP functionality
  - Paste support
- [x] Authentication context for state management
- [x] JWT token storage in localStorage
- [x] Protected routes support
- [x] Navbar integration with user info
- [x] Logout functionality
- [x] Smooth animations with Framer Motion

---

## 📧 Email Templates

### OTP Email
- Professional HTML design
- 6-digit code prominently displayed
- SPT Traders branding
- Expiration time shown

### Welcome Email
- Sent after successful registration
- Feature highlights
- Professional greeting

---

## 🔒 Security Features

1. **JWT Authentication**
   - 7-day token expiration
   - Secure token storage
   - Protected API routes

2. **OTP Security**
   - 6-digit numeric code
   - 10-minute expiration
   - Single-use verification

3. **Input Validation**
   - Email format validation
   - Phone number validation
   - Required field checks

---

## 🐛 Troubleshooting

### OTP Not Received?
1. Check Gmail App Password setup
2. Check spam folder
3. Verify EMAIL_USER and EMAIL_PASS in `.env`
4. Check backend console for errors

### MongoDB Connection Error?
1. Ensure MongoDB is running: `sudo systemctl start mongod`
2. Check MONGODB_URI in `.env`
3. Verify MongoDB is on port 27017

### CORS Error?
1. Check VITE_API_URL in frontend `.env`
2. Verify backend CORS configuration

---

## 📁 Important Files

### Backend
- `src/controllers/authController.js` - Main auth logic
- `src/models/User.js` - User schema
- `src/routes/authRoutes.js` - API routes
- `src/utils/emailService.js` - Email sending
- `src/middleware/auth.js` - JWT verification

### Frontend
- `src/contexts/AuthContext.tsx` - Auth state
- `src/pages/SignupPage.tsx` - Registration
- `src/pages/LoginPageNew.tsx` - Login wrapper
- `src/pages/OTPVerificationPage.tsx` - OTP verification
- `src/services/authService.ts` - API calls
- `src/components/Navbar.tsx` - Auth UI integration

---

## 🎨 Customization

### Change OTP Expiration
```javascript
// In authController.js
user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
// Change to: 5 * 60 * 1000 for 5 minutes
```

### Change Token Expiration
```javascript
// In authController.js
const token = jwt.sign(payload, secret, { expiresIn: '7d' });
// Change to: '1d' for 1 day, '30d' for 30 days
```

### Update Email Templates
Edit `backend/src/utils/emailService.js` to customize:
- Company branding
- Email content
- Styling and colors

---

## 📝 Next Steps

1. **Configure Gmail App Password**
   - Enable 2-factor authentication
   - Generate app password
   - Add to `.env`

2. **Test the Flow**
   - Register a new user
   - Receive welcome email
   - Login with OTP
   - Verify token storage

3. **Deploy to Production**
   - Change JWT_SECRET
   - Use production MongoDB URI
   - Enable HTTPS
   - Configure production email service

---

**For detailed documentation, see [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)**
