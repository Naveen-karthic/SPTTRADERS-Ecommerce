# 🔍 CART NOT SHOWING - DEBUGGING GUIDE

## Quick Test Steps

### Step 1: Check Browser Console
1. Open http://localhost:5173/cart
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. Look for these messages:
   - `Cart items updated:` - Shows cart data from API
   - `Cart count:` - Number of items
   - `Cart error:` - Any errors
   - `Processing cart item:` - Individual cart items

### Step 2: Check Network Request
1. Stay on http://localhost:5173/cart
2. In DevTools, go to **Network** tab
3. Look for `/api/cart` request
4. Click on it and check:
   - **Status Code**: Should be 200
   - **Response**: Should show array of cart items
   - **Request Headers**: Should have `Authorization: Bearer ...`

### Step 3: Use Debug Page
1. Go to: http://localhost:5173/cart-debug
2. This will show:
   - User info
   - Cart state (loading, error, count, total)
   - Raw cart items JSON
   - Refresh button to test API

---

## Common Issues & Fixes

### Issue 1: User Not Logged In
**Symptoms**: Cart shows empty, no items

**Check**:
```javascript
// In browser console, run:
localStorage.getItem('token')
localStorage.getItem('user')
```

**Fix**: If null, login again:
```bash
# Go to http://localhost:5173/login
# Login with your credentials
```

---

### Issue 2: Wrong Product Reference
**Symptoms**: Cart has items but shows "Unknown Product"

**Cause**: Product was deleted or wrong product collection

**Check Backend**:
```bash
# Check if products exist in database
cd backend
node
> const mongoose = require('mongoose');
> mongoose.connect('mongodb://localhost:27017/spt-traders');
> const Product = require('./src/models/Product');
> const Cart = require('./src/models/Cart');

> // Check cart items
> Cart.find({}).populate('productId').then(console.log);
```

**Fix**: Check if products exist in both collections:
- Grocery Products: `/api/products`
- Fertilizer Products: `/api/fertilizer-products`

---

### Issue 3: Auth Token Not Sending
**Symptoms**: 401 Unauthorized error in Network tab

**Check**:
1. Network tab → `/api/cart` request
2. Look for `Authorization` header
3. If missing, token is not being sent

**Fix**: Manually test with token:
```bash
# Get your token from localStorage
TOKEN="your-token-here"

# Test API
curl http://localhost:5001/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

---

### Issue 4: Cart Empty in Backend
**Symptoms**: API returns empty array `[]`

**Check Backend**:
```bash
# Check database directly
cd backend
node
> const mongoose = require('mongoose');
> mongoose.connect('mongodb://localhost:27017/spt-traders');
> const Cart = require('./src/models/Cart');

> // Get your user ID from localStorage.user
> Cart.find({ userId: "YOUR_USER_ID" }).then(console.log);
```

**If empty**: Items not being added to cart. Check addToCart function.

---

### Issue 5: Populate Not Working
**Symptoms**: Cart items have `productId: null` or `productId: "..."` (string, not object)

**Backend Fix**:
```javascript
// backend/src/controllers/cartController.js

exports.getCart = async (req, res) => {
  try {
    console.log('Fetching cart for user:', req.user.id);

    const cartItems = await Cart.find({ userId: req.user.id })
      .populate('productId')
      .exec();  // Add .exec()

    console.log('Cart items found:', cartItems);

    res.status(200).json(cartItems);
  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ error: err.message });
  }
};
```

---

## Manual Test Procedure

### Test 1: Add Item to Cart
1. Go to http://localhost:5173 (Home page)
2. Login if not logged in
3. Click "Add to Cart" on any product
4. Check for notification "Item added to cart!"
5. Check browser console for errors

### Test 2: Check Cart API Directly
```bash
# 1. Get token (from browser localStorage)
TOKEN=$(echo 'localStorage.getItem("token")' | pbcopy)  # macOS
# or manually copy from browser console

# 2. Test get cart
curl http://localhost:5001/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected output:
# [{"_id":"...","userId":"...","productId":{...},"quantity":1,...}]
```

### Test 3: Add Item via API
```bash
# Get a product ID first from /api/products
PRODUCT_ID="some-product-id"

curl -X POST http://localhost:5001/api/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"'$PRODUCT_ID'","quantity":1,"price":100}'
```

---

## Database Check

### Check Cart Collection
```bash
# Connect to MongoDB
mongosh

# Use database
use spt-traders

# Check cart items
db.carts.find().pretty()

# Check specific user
db.carts.find({userId: ObjectId("YOUR_USER_ID")}).pretty()

# Count items
db.carts.countDocuments({userId: ObjectId("YOUR_USER_ID")})
```

### Check Products
```bash
# Check if products exist
db.products.find().limit(1).pretty()

# Check fertilizers
db.fertilizers.find().limit(1).pretty()
```

---

## Expected Flow

### Add to Cart Flow:
1. User clicks "Add to Cart"
2. Frontend: `addToCart(productId, 1, price)` called
3. API: `POST /api/cart/add` with token
4. Backend: Verifies token, gets `req.user.id`
5. Backend: Saves cart item with `userId: req.user.id`
6. Frontend: Refreshes cart with `fetchCart()`

### View Cart Flow:
1. User goes to /cart
2. CartContext: `useEffect` calls `fetchCart()`
3. API: `GET /api/cart` with token
4. Backend: Finds items where `userId: req.user.id`
5. Backend: Populates `productId` field
6. Frontend: Receives cart items, displays them

---

## Quick Fixes

### Fix 1: Restart Backend
```bash
cd backend
# Stop server (Ctrl+C)
npm start
```

### Fix 2: Clear Frontend Cache
```javascript
// In browser console:
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### Fix 3: Check Backend Logs
```bash
# Backend terminal should show:
# POST /api/cart/add - 200
# GET /api/cart - 200
```

### Fix 4: Verify Environment Variables
```bash
# backend/.env
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/spt-traders
PORT=5001
```

---

## Still Not Working?

### Check List:
- [ ] Backend running on port 5001?
- [ ] Frontend running on port 5173?
- [ ] MongoDB running?
- [ ] User logged in (check localStorage)?
- [ ] Token valid (not expired)?
- [ ] Cart items in database?
- [ ] Products exist in database?
- [ ] No CORS errors in console?
- [ ] No network errors in DevTools?

### Get Diagnostic Info:
1. Open http://localhost:5173/cart-debug
2. Take a screenshot
3. Open browser console (F12)
4. Take screenshot of Network tab → /api/cart
5. Share screenshots for help
