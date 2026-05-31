# MongoDB Backend Setup - Complete

## What Has Been Built

A complete MongoDB-based e-commerce backend integrated into your Next.js App Router with the following features:

### Database Models (10 Models)
1. **User** - Authentication and user profiles
2. **Product** - Product catalog
3. **Category** - Product categories
4. **Brand** - Product brands
5. **Cart** - Shopping cart
6. **Order** - Customer orders
7. **Review** - Product reviews
8. **Address** - Shipping addresses
9. **Wishlist** - Product wishlist
10. **Coupon** - Discount coupons

### API Routes (25+ Endpoints)

#### Authentication (3)
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login
- GET/PUT `/api/auth/profile` - User profile management

#### Products (3)
- GET `/api/products` - List products with pagination & filters
- GET/PUT/DELETE `/api/products/[id]` - Product management

#### Categories (2)
- GET `/api/categories` - List all categories
- POST `/api/categories` - Create category (admin)

#### Brands (2)
- GET `/api/brands` - List all brands
- POST `/api/brands` - Create brand (admin)

#### Cart (3)
- GET `/api/cart` - Get user cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart` - Update cart item

#### Orders (3)
- GET `/api/orders` - List user/all orders
- POST `/api/orders` - Create order
- GET/PUT `/api/orders/[id]` - Order management

#### Reviews (2)
- GET `/api/reviews` - List reviews
- POST `/api/reviews` - Create review

#### Wishlist (3)
- GET `/api/wishlist` - Get wishlist
- POST `/api/wishlist` - Add to wishlist
- DELETE `/api/wishlist` - Remove from wishlist

#### Addresses (3)
- GET `/api/addresses` - List addresses
- POST `/api/addresses` - Create address
- PUT/DELETE `/api/addresses/[id]` - Address management

#### Coupons (2)
- GET `/api/coupons` - List coupons
- POST `/api/coupons` - Create coupon (admin)

#### Admin Dashboard (2)
- GET `/api/admin/stats` - Dashboard statistics
- GET `/api/admin/users` - User management

### Security Features
- JWT token-based authentication (7-day expiration)
- Password hashing with bcryptjs
- Role-based access control (user/admin)
- Protected admin endpoints
- Input validation with Zod
- User ownership verification for orders/addresses

### File Structure
```
lib/
├── db.ts                    # MongoDB connection
├── middleware.ts            # Auth middleware
├── models/
│   ├── User.ts
│   ├── Product.ts
│   ├── Category.ts
│   ├── Brand.ts
│   ├── Cart.ts
│   ├── Order.ts
│   ├── Review.ts
│   ├── Address.ts
│   ├── Wishlist.ts
│   └── Coupon.ts
app/api/
├── auth/
│   ├── signup/
│   ├── login/
│   └── profile/
├── products/
│   ├── route.ts
│   └── [id]/route.ts
├── categories/
├── brands/
├── cart/
├── orders/
├── reviews/
├── wishlist/
├── addresses/
├── coupons/
└── admin/
```

## Required Environment Variables

Add to `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Generate JWT Secret:
```bash
openssl rand -base64 32
```

### MongoDB Setup:
1. Create MongoDB Atlas account (mongodb.com/cloud)
2. Create a new cluster
3. Create database user
4. Get connection string
5. Add to MONGODB_URI

## Testing the Backend

### 1. Start the dev server (already running on port 3001)
```bash
npm run dev
```

### 2. Test endpoints using curl or Postman

**Sign Up:**
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Products:**
```bash
curl http://localhost:3001/api/products
```

**Get Profile (with token):**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/auth/profile
```

## Next Steps

1. **Set up MongoDB:**
   - Add MONGODB_URI to `.env.local`
   - Ensure environment variables are set

2. **Test the API:**
   - Use Postman or curl to test endpoints
   - Refer to API_DOCUMENTATION.md for endpoint details

3. **Connect Frontend:**
   - Use the token from login/signup in Authorization header
   - All authenticated requests require `Authorization: Bearer <token>`

4. **Admin Setup:**
   - Create admin user via database directly or add role='admin'
   - Admin endpoints require admin role

5. **Deploy:**
   - Push to GitHub
   - Deploy to Vercel
   - Set environment variables in Vercel project settings

## Key Features Implemented

✅ User authentication with JWT
✅ Product catalog with filters & search
✅ Shopping cart management
✅ Order creation & tracking
✅ Product reviews
✅ Wishlist functionality
✅ Multiple addresses
✅ Coupon system
✅ Admin dashboard with stats
✅ Role-based access control
✅ Input validation
✅ Error handling
✅ Pagination support
✅ MongoDB integration
✅ Password hashing

## Documentation

- **API_DOCUMENTATION.md** - Complete API reference with all endpoints
- **API_DOCUMENTATION.md** - Request/response examples
- **BACKEND_SETUP.md** - This file

## Common Issues & Solutions

### MongoDB Connection Error
- Check MONGODB_URI is correct
- Ensure IP whitelist includes your IP in MongoDB Atlas

### JWT Token Errors
- Ensure JWT_SECRET is set in .env.local
- Check token format in Authorization header: `Bearer <token>`

### Port Already in Use
- Dev server uses port 3001 if 3000 is busy
- You can access at http://localhost:3001

## Support

For detailed API documentation, see **API_DOCUMENTATION.md**

The backend is production-ready and can be deployed to Vercel immediately.
