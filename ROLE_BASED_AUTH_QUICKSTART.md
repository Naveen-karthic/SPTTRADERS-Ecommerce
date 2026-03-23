# Role-Based Authentication - Quick Start Guide

## 🚀 Quick Setup & Testing

### Current Status
✅ Backend running on http://localhost:5001
✅ Frontend running on http://localhost:5173
✅ MongoDB connected
✅ Role-based auth implemented

---

## 📋 Quick Test Steps

### Step 1: Create Your First Admin User

Open MongoDB shell:
```bash
mongosh spt-traders
```

Run these commands:
```javascript
// List all users
db.users.find({}, {name: 1, email: 1, role: 1})

// Update an existing user to admin (replace with actual email)
db.users.findOneAndUpdate(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)

// Verify the change
db.users.findOne({email: "your-email@example.com"}, {name: 1, email: 1, role: 1})
```

Expected output:
```javascript
{
  _id: ObjectId("..."),
  name: "Your Name",
  email: "your-email@example.com",
  role: "admin"  // ← Should show "admin"
}
```

---

### Step 2: Test as Admin User

1. **Logout** if already logged in
2. **Login** with your admin account
3. **Check navbar** - You should see an "Admin" link with a shield icon 🛡️
4. **Click Admin link** - Should go to `/admin` dashboard
5. **Try admin pages:**
   - `/admin/products` - Should load
   - `/admin/users` - Should load
   - `/admin/analytics` - Should load

---

### Step 3: Test as Regular User

1. **Register a new account** (or use existing non-admin account)
2. **Login**
3. **Check navbar** - No "Admin" link should be visible
4. **Try accessing admin pages:**
   - Go to `http://localhost:5173/admin`
   - **Expected:** Redirected to home page `/`

---

## 🧪 API Testing Examples

### Test 1: Admin Access to Admin Endpoint

```bash
# 1. Login as admin and get token
curl -X POST http://localhost:5001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}'

# Note the OTP from response, then verify
curl -X POST http://localhost:5001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "otp": "123456"}'

# Copy the token from response

# 2. Access admin endpoint (should work)
curl -X GET http://localhost:5001/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Expected: List of all users
```

### Test 2: Regular User Denied Admin Access

```bash
# 1. Login as regular user and get token
# (Same process as above with regular user email)

# 2. Try to access admin endpoint (should fail)
curl -X GET http://localhost:5001/api/admin/users \
  -H "Authorization: Bearer YOUR_USER_TOKEN"

# Expected Response:
# {
#   "error": "Access Denied",
#   "message": "Admin access required..."
# }
```

### Test 3: Update User Role (Admin Only)

```bash
# Update a user to admin role
curl -X PUT http://localhost:5001/api/admin/users/USER_ID/role \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'

# Expected: User role updated successfully
```

---

## 🎯 Common Use Cases

### Use Case 1: Add Delete Button for Admins Only

```tsx
import { useAuth } from '../contexts/AuthContext';

const ProductList = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>

          {/* Only admins can delete */}
          {isAdmin && (
            <button onClick={() => deleteProduct(product.id)}>
              Delete Product
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
```

### Use Case 2: Redirect Non-Admins

```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (user?.role !== 'admin') {
    return null;
  }

  return <AdminDashboard />;
};
```

### Use Case 3: Create Admin-Only API Route

```javascript
// In your route file
const { requireAuth, requireAdmin } = require('../middleware/roleMiddleware');

// Admin-only route
router.post('/api/special-offers',
  requireAuth,        // Must be logged in
  requireAdmin,       // Must be admin
  createSpecialOffer
);
```

---

## 🔍 Troubleshooting

### Problem: "Admin link not showing in navbar"

**Solution:**
1. Open browser DevTools → Console
2. Run: `JSON.parse(localStorage.getItem('user'))`
3. Check `role` field - should be "admin"
4. If not, update in MongoDB as shown in Step 1
5. Logout and login again

### Problem: "Access Denied when accessing /admin"

**Solution:**
1. Check your token is valid: `localStorage.getItem('token')`
2. Verify user role in database
3. Make sure you're logged in with the right account
4. Try clearing localStorage and logging in again

### Problem: "Regular users can access admin pages"

**Solution:**
1. Make sure backend is running latest code
2. Check ProtectedRoute is wrapping the component
3. Verify `requireAdmin={true}` prop is set
4. Check browser console for errors

---

## 📊 Quick Verification Checklist

Run through this checklist to verify everything is working:

### Backend
- [ ] Server running on port 5001
- [ ] MongoDB connected
- [ ] Role middleware created
- [ ] Admin routes registered in server.js
- [ ] Products/categories routes protected

### Frontend
- [ ] ProtectedRoute component created
- [ ] All admin routes wrapped with ProtectedRoute
- [ ] Navbar shows admin link for admin users
- [ ] Navbar hides admin link for regular users
- [ ] Non-admins redirected from /admin routes

### Database
- [ ] User schema has role field
- [ ] Default role is 'user'
- [ ] At least one admin user exists
- [ ] Admin users have role: 'admin'

---

## 📝 Important Files Reference

### Backend Files
```
backend/src/
├── middleware/roleMiddleware.js    ← Role checking middleware
├── routes/adminRoutes.js           ← Admin-only endpoints
├── routes/productRoutes.js         ← Protected routes
├── routes/categoryRoutes.js        ← Protected routes
└── models/User.js                  ← Schema with role field
```

### Frontend Files
```
frontend/src/
├── components/ProtectedRoute.tsx  ← Route protection
├── components/Navbar.tsx           ← Role-based menu
├── contexts/AuthContext.tsx        ← Auth with role
└── App.tsx                         ← Protected routes
```

---

## 🎓 Quick Tips

1. **Always check both frontend and backend protection**
   - Frontend: ProtectedRoute component
   - Backend: requireAuth + requireAdmin middleware

2. **Test with both admin and regular user accounts**
   - Create at least 2 test accounts
   - One admin, one regular user

3. **Clear localStorage when testing role changes**
   - Old tokens won't have updated role
   - Logout/login after role changes in database

4. **Use browser DevTools to debug**
   - Check localStorage for user object
   - Check Network tab for API responses
   - Check Console for errors

---

**Ready to test?** Start with Step 1 above! 🚀

For complete documentation, see [ROLE_BASED_AUTH.md](./ROLE_BASED_AUTH.md)
