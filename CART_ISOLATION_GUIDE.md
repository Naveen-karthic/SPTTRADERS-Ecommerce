# User-Specific Cart Implementation Guide

## 🎯 Problem Solved

**Before**: Cart was stored in localStorage, causing User 2 to see User 1's cart items.
**After**: Each user has their own isolated cart stored in the database with proper authentication.

---

## 📋 Backend Implementation (Node.js + Express)

### 1. Cart Model (Already Correct ✅)
```javascript
// backend/src/models/Cart.js
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true }
}, { timestamps: true });
```

### 2. Cart Controller with Security
```javascript
// backend/src/controllers/cartController.js

// GET cart - Only returns logged-in user's items
exports.getCart = async (req, res) => {
  try {
    // req.user.id comes from auth middleware
    const cartItems = await Cart.find({ userId: req.user.id })
      .populate('productId');
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST add to cart - Links item to logged-in user
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;

    // Check if item already exists in user's cart
    let cartItem = await Cart.findOne({
      userId: req.user.id,  // 🔒 KEY: User-specific
      productId
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({
        userId: req.user.id,  // 🔒 KEY: Link to logged-in user
        productId,
        quantity,
        price
      });
    }

    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE item - Security check to prevent cross-user deletion
exports.removeFromCart = async (req, res) => {
  try {
    // 🔒 SECURITY: Verify item belongs to logged-in user
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      userId: req.user.id  // MUST match logged-in user
    });

    if (!cartItem) {
      return res.status(404).json({
        error: 'Cart item not found or unauthorized'
      });
    }

    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update quantity - Also has user verification
exports.updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    // 🔒 SECURITY: Verify ownership
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!cartItem) {
      return res.status(404).json({
        error: 'Cart item not found or unauthorized'
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE clear all cart items for user
exports.clearCart = async (req, res) => {
  try {
    // Only removes items for THIS user
    await Cart.deleteMany({ userId: req.user.id });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

### 3. Protected Routes
```javascript
// backend/src/routes/cartRoutes.js
const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart
} = require('../controllers/cartController');
const auth = require('../middleware/auth'); // 🔒 Required for all routes
const router = express.Router();

// ALL routes require authentication
router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.put('/:id', auth, updateCartQuantity);
router.delete('/:id', auth, removeFromCart);
router.delete('/clear/all', auth, clearCart);

module.exports = router;
```

### 4. Auth Middleware (Must have this)
```javascript
// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 🎨 Frontend Implementation (React + TypeScript)

### 1. Cart Service with Auth
```typescript
// frontend/src/services/cartService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with auth interceptor
const cartApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔒 KEY: Add auth token to EVERY request
cartApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors - redirect to login
cartApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const getCart = async () => {
  const response = await cartApi.get('/cart');
  return response.data;
};

export const addToCart = async (productId: string, quantity: number, price: number) => {
  const response = await cartApi.post('/cart/add', {
    productId,
    quantity,
    price,
  });
  return response.data;
};

export const updateCartQuantity = async (cartItemId: string, quantity: number) => {
  const response = await cartApi.put(`/cart/${cartItemId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (cartItemId: string) => {
  const response = await cartApi.delete(`/cart/${cartItemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await cartApi.delete('/cart/clear/all');
  return response.data;
};
```

### 2. Cart Context (Global State)
```typescript
// frontend/src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as cartService from '../services/cartService';

interface CartContextType {
  cartItems: any[];
  loading: boolean;
  cartCount: number;
  cartTotal: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, price: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number, price: number) => {
    await cartService.addToCart(productId, quantity, price);
    await fetchCart(); // Refresh cart
  };

  const cartCount = cartItems.reduce((count: number, item: any) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);

  // Load cart when user logs in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      cartCount,
      cartTotal,
      fetchCart,
      addToCart,
      updateQuantity: cartService.updateCartQuantity,
      removeFromCart: cartService.removeFromCart,
      clearCart: cartService.clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
```

### 3. Wrap App with Providers
```tsx
// frontend/src/App.tsx
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};
```

### 4. Use Cart in Components
```tsx
// Example: Product card
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1, product.price);
      alert('Added to cart!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
};

// Example: Navbar cart count
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <Link to="/cart">
      <ShoppingCart />
      {cartCount > 0 && (
        <span className="badge">{cartCount}</span>
      )}
    </Link>
  );
};
```

---

## ✅ Testing Steps

### Test 1: User Isolation
1. **Login as User 1** (user1@test.com)
2. Add Product A to cart
3. Logout
4. **Login as User 2** (user2@test.com)
5. ✅ Cart should be EMPTY (not showing Product A)
6. Add Product B to cart
7. Logout
8. **Login as User 1 again**
9. ✅ Should see only Product A (not Product B)

### Test 2: Security
1. Login as User 1
2. Add item to cart, note the cart item ID
3. Try to delete/update that item via Postman with User 2's token
4. ✅ Should get 404/403 error

---

## 🔒 Best Practices to Prevent Future Issues

### ✅ DO:
1. **Always use `req.user.id`** from auth middleware in cart operations
2. **Add ownership checks** before delete/update operations
3. **Use axios interceptors** to automatically add auth tokens
4. **Store cart in database**, not localStorage
5. **Use context/recoil** for global cart state
6. **Handle 401 errors** with automatic redirect to login

### ❌ DON'T:
1. ❌ Use `localStorage` for cart (shared across users)
2. ❌ Send `userId` in request body (can be spoofed)
3. ❌ Forget ownership checks in delete/update
4. ❌ Store other users' data in client state
5. ❌ Use global cart variable without user context

---

## 🔑 Key Security Points

1. **Backend**: Always filter by `req.user.id` (never trust client-provided userId)
2. **Frontend**: Always send auth token in `Authorization: Bearer ${token}` header
3. **Middleware**: Use auth middleware on ALL cart routes
4. **Ownership**: Verify user owns cart item before delete/update

---

## 📊 Database Schema

```javascript
Cart Collection:
{
  _id: ObjectId,
  userId: ObjectId,      // 🔒 Links to User who owns it
  productId: ObjectId,    // Links to Product
  quantity: Number,
  price: Number,
  createdAt: Date,
  updatedAt: Date
}

// Index for performance
{ userId: 1, productId: 1 } // Unique
```

---

## 🚀 Summary

**What Changed:**
- ❌ **Before**: Cart in `localStorage` (global, shared)
- ✅ **After**: Cart in database with `userId` (user-specific)

**Security:**
- All cart routes require authentication
- `req.user.id` used in all queries
- Ownership checks on delete/update operations

**Frontend:**
- Removed localStorage cart usage
- Added CartContext for global state
- Axios interceptor adds auth token automatically

**Result:** Each user sees only their own cart! 🎉
