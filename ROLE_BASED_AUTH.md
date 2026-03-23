# Role-Based Authentication System - Complete Guide

This document explains the role-based authentication (RBAC) implementation for the SPT Traders e-commerce application.

## Table of Contents
1. [Overview](#overview)
2. [User Roles](#user-roles)
3. [Database Schema](#database-schema)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [Usage Examples](#usage-examples)
7. [Testing](#testing)

---

## Overview

The application implements a role-based access control system with two roles:
- **User**: Regular customers who can browse products and place orders
- **Admin**: Administrators with full access to manage the application

### Key Features:
✅ JWT-based authentication
✅ Role-based route protection (backend & frontend)
✅ Automatic redirection based on user role
✅ Dynamic UI based on user permissions
✅ Secure admin-only endpoints

---

## User Roles

### 1. User (Default Role)
**Can:**
- Browse products and categories
- Add items to cart
- Place orders
- View their own profile
- Access public routes

**Cannot:**
- Access admin dashboard (`/admin`)
- Create/update/delete products
- Create/update/delete categories
- Manage other users
- View admin statistics

### 2. Admin
**Can do everything a User can, plus:**
- Access admin dashboard
- Create, update, and delete products
- Create, update, and delete categories
- View all users
- Update user roles
- View admin analytics and statistics
- Manage orders and offers

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
  role: String (enum: ['user', 'admin'], default: 'user'), // ← Role field
  otp: String (optional),
  otpExpires: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Default Role:** All new users are assigned the `'user'` role by default.

**Role Values:**
- `'user'` - Regular customer
- `'admin'` - Administrator

---

## Backend Implementation

### 1. Role-Based Middleware

**Location:** `backend/src/middleware/roleMiddleware.js`

```javascript
const { requireAuth, requireAdmin, requireAdminOrSelf } = require('../middleware/roleMiddleware');
```

#### Available Middleware Functions:

##### `requireAuth`
Ensures the user is authenticated (has valid JWT token).

```javascript
router.get('/protected', requireAuth, controller);
```

##### `requireAdmin`
Ensures the authenticated user has an 'admin' role.

```javascript
router.post('/admin/products', requireAuth, requireAdmin, createProduct);
```

##### `requireAdminOrSelf`
Allows access if user is admin OR accessing their own data.

```javascript
router.get('/users/:id', requireAuth, requireAdminOrSelf, getUser);
```

##### `requireUser`
Ensures the authenticated user has 'user' role (not admin).

```javascript
router.get('/user-specific', requireAuth, requireUser, controller);
```

### 2. Protected API Routes

#### Product Routes
```javascript
// Public - Anyone can view
GET /api/products

// Admin only - Must be authenticated + admin role
POST /api/products
DELETE /api/products/:id
```

#### Category Routes
```javascript
// Public - Anyone can view
GET /api/item-master

// Admin only - Must be authenticated + admin role
POST /api/item-master
DELETE /api/item-master/:id
```

#### Admin Routes (New)
```javascript
// Get all users (admin only)
GET /api/admin/users

// Get specific user (admin only)
GET /api/admin/users/:id

// Update user role (admin only)
PUT /api/admin/users/:id/role

// Delete user (admin only)
DELETE /api/admin/users/:id

// Get admin statistics (admin only)
GET /api/admin/stats
```

### 3. Middleware Usage Examples

#### Example 1: Public Route (No Authentication)
```javascript
router.get('/products', getProducts);
```

#### Example 2: Authenticated Route (Any Logged-in User)
```javascript
router.get('/profile', requireAuth, getProfile);
```

#### Example 3: Admin-Only Route
```javascript
router.post('/products', requireAuth, requireAdmin, createProduct);
```

#### Example 4: Admin or Self (User Can Access Own Data)
```javascript
router.get('/users/:id', requireAuth, requireAdminOrSelf, getUserById);
```

---

## Frontend Implementation

### 1. ProtectedRoute Component

**Location:** `frontend/src/components/ProtectedRoute.tsx`

```typescript
interface ProtectedRouteProps {
  children: React.ReactElement;
  requireAdmin?: boolean;
}
```

**Usage:**

```jsx
// Regular authenticated route
<ProtectedRoute>
  <ProfilePage />
</ProtectedRoute>

// Admin-only route
<ProtectedRoute requireAdmin={true}>
  <AdminDashboard />
</ProtectedRoute>
```

**Behavior:**
- If not authenticated → Redirect to `/login`
- If `requireAdmin=true` and not admin → Redirect to `/`
- If authenticated + has required role → Render children

### 2. Role-Based Navigation

**Location:** `frontend/src/components/Navbar.tsx`

```typescript
const isAdmin = user?.role === 'admin';

// Only show admin link to admins
{isAdmin && (
  <Link to="/admin">
    <Shield className="w-4 h-4" />
    Admin
  </Link>
)}
```

### 3. Protected Routes in App.tsx

```jsx
<Route
  path="/admin/products"
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout>
        <ProductManagement />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
```

### 4. Accessing User Role in Components

```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  if (user.role === 'admin') {
    return <AdminPanel />;
  }

  return <UserPanel />;
};
```

---

## Usage Examples

### Example 1: Creating an Admin User

**Method 1: Using MongoDB Shell**
```javascript
// Connect to MongoDB
mongosh spt-traders

// Update a user to admin role
db.users.findOneAndUpdate(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Method 2: Using API (Admin Only)**
```bash
curl -X PUT http://localhost:5001/api/admin/users/USER_ID/role \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

### Example 2: Protecting a New Route

**Backend:**
```javascript
const { requireAuth, requireAdmin } = require('../middleware/roleMiddleware');

// Admin-only route
router.post('/api/special-offers', requireAuth, requireAdmin, createOffer);
```

**Frontend:**
```jsx
<Route
  path="/special-offers"
  element={
    <ProtectedRoute requireAdmin={true}>
      <SpecialOffersPage />
    </ProtectedRoute>
  }
/>
```

### Example 3: Conditional Rendering Based on Role

```typescript
const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.price}</p>

      {/* Only admins can delete products */}
      {isAdmin && (
        <button onClick={() => deleteProduct(product.id)}>
          Delete
        </button>
      )}
    </div>
  );
};
```

---

## Testing

### Test Scenario 1: Regular User Access

1. **Register a new user** (role will be 'user' by default)
2. **Login** with the new user
3. **Try to access** `/admin`
4. **Expected:** Redirected to home page

**Test:**
```bash
# Login as regular user
curl -X POST http://localhost:5001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Try to access admin endpoint (should fail)
curl -X GET http://localhost:5001/api/admin/users \
  -H "Authorization: Bearer USER_TOKEN"

# Expected Response:
# {
#   "error": "Access Denied",
#   "message": "Admin access required..."
# }
```

### Test Scenario 2: Admin User Access

1. **Create an admin user** (update role in database)
2. **Login** as admin
3. **Access** `/admin`
4. **Expected:** Admin dashboard loads successfully

**Test:**
```bash
# Update user to admin (mongosh)
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)

# Login as admin
curl -X POST http://localhost:5001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}'

# Access admin endpoint (should succeed)
curl -X GET http://localhost:5001/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Expected Response:
# {
#   "users": [...]
# }
```

### Test Scenario 3: Admin Dashboard Link Visibility

1. **Login as regular user**
2. **Check navbar**
3. **Expected:** No "Admin" link visible

4. **Logout and login as admin**
5. **Check navbar**
6. **Expected:** "Admin" link with shield icon visible

---

## API Response Examples

### Access Denied Response (403)

```json
{
  "error": "Access Denied",
  "message": "Admin access required. You do not have permission to access this resource."
}
```

### Success Response (Admin)

```json
{
  "users": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "1234567890",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Security Considerations

### ✅ Implemented Security Measures

1. **JWT Token Verification**
   - All protected routes verify JWT token
   - Tokens contain user role in payload
   - Tokens expire after 7 days

2. **Role Validation**
   - Backend validates role on every request
   - Frontend redirects unauthorized users
   - Double-layer protection (backend + frontend)

3. **Route Protection**
   - Admin routes protected on backend
   - Admin routes protected on frontend
   - Automatic redirection for unauthorized access

### 📋 Recommended Enhancements

1. **Refresh Tokens**
   ```javascript
   // Implement token rotation
   router.post('/refresh-token', refreshAccessToken);
   ```

2. **Rate Limiting**
   ```javascript
   // Prevent brute force attacks
   const rateLimit = require('express-rate-limit');
   ```

3. **Activity Logging**
   ```javascript
   // Log admin actions
   router.post('/admin/products', logAdminAction, createProduct);
   ```

4. **Permission System**
   ```javascript
   // Granular permissions instead of just roles
   const permissions = {
     createProduct: ['admin'],
     deleteProduct: ['admin'],
     updateProduct: ['admin']
   };
   ```

---

## File Structure

### Backend
```
backend/
├── src/
│   ├── middleware/
│   │   ├── auth.js                    # JWT authentication
│   │   └── roleMiddleware.js          # Role-based middleware ⭐ NEW
│   ├── models/
│   │   └── User.js                    # User schema with role field
│   ├── routes/
│   │   ├── adminRoutes.js             # Admin-only endpoints ⭐ NEW
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js           # Updated with role protection
│   │   └── categoryRoutes.js          # Updated with role protection
│   └── server.js
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.tsx         # Route protection component ⭐ NEW
│   │   └── Navbar.tsx                 # Updated with role-based menu
│   ├── contexts/
│   │   └── AuthContext.tsx            # Auth state with role
│   ├── pages/
│   │   ├── LoginPageNew.tsx
│   │   └── SignupPage.tsx
│   └── App.tsx                        # Updated with protected routes
```

---

## Quick Reference

### Middleware Quick Reference

| Middleware | Purpose | Usage |
|------------|---------|------|
| `requireAuth` | User must be logged in | All authenticated routes |
| `requireAdmin` | User must have admin role | Admin-only routes |
| `requireAdminOrSelf` | Admin or own data | User profile routes |
| `requireUser` | User must have 'user' role | User-specific routes |

### Frontend Component Props

```typescript
<ProtectedRoute
  requireAdmin={false}  // Optional: true for admin-only routes
>
  <YourComponent />
</ProtectedRoute>
```

### Common Tasks

**Create Admin:**
```javascript
db.users.updateOne({email: "user@example.com"}, {$set: {role: "admin"}})
```

**Check User Role:**
```javascript
const { user } = useAuth();
console.log(user.role); // 'user' or 'admin'
```

**Protect Component:**
```jsx
<ProtectedRoute requireAdmin={true}>
  <AdminOnlyComponent />
</ProtectedRoute>
```

---

## Troubleshooting

### Issue: "Access Denied" on Admin Route

**Cause:** User doesn't have admin role

**Solution:**
1. Check user's role in database
2. Update role to 'admin' if needed
3. Logout and login again to refresh token

### Issue: Admin Link Not Showing

**Cause:** User role is not 'admin'

**Solution:**
1. Check localStorage for user object
2. Verify role field: `JSON.parse(localStorage.getItem('user')).role`
3. Update role in database

### Issue: Routes Not Protected

**Cause:** ProtectedRoute not wrapping component

**Solution:**
```jsx
// ❌ Wrong
<Route path="/admin" element={<AdminDashboard />} />

// ✅ Correct
<Route path="/admin" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

**Last Updated:** March 2025
**Version:** 1.0.0
