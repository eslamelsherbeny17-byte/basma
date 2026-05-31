# E-Commerce Backend API Documentation

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Generate JWT Secret
```bash
openssl rand -base64 32
```

### 3. Install Dependencies
Dependencies are already installed: mongoose, bcryptjs, jsonwebtoken, zod

## API Endpoints

### Authentication

#### Sign Up
- **POST** `/api/auth/signup`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** User object + JWT token

#### Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** User object + JWT token

#### Get Profile
- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User profile

#### Update Profile
- **PUT** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Jane Doe",
  "phone": "+1234567890",
  "avatar": "url-to-avatar"
}
```

### Products

#### Get All Products
- **GET** `/api/products?page=1&limit=10&search=&category=&brand=&sort=-createdAt`
- **Query Params:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search by name or description
  - `category`: Filter by category ID
  - `brand`: Filter by brand ID
  - `sort`: Sort field (default: -createdAt)
- **Response:** Products array + pagination

#### Get Product Details
- **GET** `/api/products/{id}`
- **Response:** Product details with reviews

#### Create Product (Admin only)
- **POST** `/api/products`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "discountPrice": 79.99,
  "image": "main-image-url",
  "images": ["image1", "image2"],
  "category": "category-id",
  "brand": "brand-id",
  "stock": 100
}
```

#### Update Product (Admin only)
- **PUT** `/api/products/{id}`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Body:** Same as create (any field)

#### Delete Product (Admin only)
- **DELETE** `/api/products/{id}`
- **Headers:** `Authorization: Bearer <admin-token>`

### Categories

#### Get All Categories
- **GET** `/api/categories`
- **Response:** Categories array

#### Create Category (Admin only)
- **POST** `/api/categories`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Body:**
```json
{
  "name": "Category Name",
  "description": "Category description",
  "image": "category-image-url"
}
```

### Brands

#### Get All Brands
- **GET** `/api/brands`
- **Response:** Brands array

#### Create Brand (Admin only)
- **POST** `/api/brands`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Body:**
```json
{
  "name": "Brand Name",
  "description": "Brand description",
  "logo": "brand-logo-url"
}
```

### Cart

#### Get User Cart
- **GET** `/api/cart`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Cart object with items

#### Add to Cart
- **POST** `/api/cart`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "productId": "product-id",
  "quantity": 2
}
```

#### Update Cart Item
- **PUT** `/api/cart`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "productId": "product-id",
  "quantity": 5
}
```
- **Note:** Set quantity to 0 to remove item

### Orders

#### Get User Orders
- **GET** `/api/orders?page=1&limit=10`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:**
  - `page`: Page number
  - `limit`: Items per page
- **Note:** Admins see all orders, users see only their orders

#### Create Order
- **POST** `/api/orders`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit-card"
}
```
- **Response:** Created order object

#### Get Order Details
- **GET** `/api/orders/{id}`
- **Headers:** `Authorization: Bearer <token>`
- **Note:** Users can only see their own orders

#### Update Order Status (Admin only)
- **PUT** `/api/orders/{id}`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Body:**
```json
{
  "orderStatus": "shipped",
  "paymentStatus": "completed",
  "trackingNumber": "TRACK123"
}
```
- **Order Status:** pending, processing, shipped, delivered, cancelled
- **Payment Status:** pending, completed, failed

### Reviews

#### Get Product Reviews
- **GET** `/api/reviews?productId={id}&page=1&limit=10`
- **Query Params:**
  - `productId`: Product ID (optional)
  - `page`: Page number
  - `limit`: Items per page

#### Create Review
- **POST** `/api/reviews`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "productId": "product-id",
  "rating": 5,
  "comment": "Great product!"
}
```
- **Rating:** 1-5

### Wishlist

#### Get User Wishlist
- **GET** `/api/wishlist`
- **Headers:** `Authorization: Bearer <token>`

#### Add to Wishlist
- **POST** `/api/wishlist`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "productId": "product-id"
}
```

#### Remove from Wishlist
- **DELETE** `/api/wishlist?productId={id}`
- **Headers:** `Authorization: Bearer <token>`

### Addresses

#### Get User Addresses
- **GET** `/api/addresses`
- **Headers:** `Authorization: Bearer <token>`

#### Create Address
- **POST** `/api/addresses`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "postalCode": "10001",
  "country": "USA",
  "isDefault": true
}
```

#### Update Address
- **PUT** `/api/addresses/{id}`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Same as create

#### Delete Address
- **DELETE** `/api/addresses/{id}`
- **Headers:** `Authorization: Bearer <token>`

### Coupons

#### Get Coupons
- **GET** `/api/coupons?code=SAVE10`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:**
  - `code`: Coupon code (optional)

#### Create Coupon (Admin only)
- **POST** `/api/coupons`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Body:**
```json
{
  "code": "SAVE10",
  "discount": 10,
  "discountType": "percentage",
  "minAmount": 50,
  "maxUses": 100,
  "expiresAt": "2025-12-31T23:59:59Z"
}
```
- **Discount Type:** percentage or fixed

### Admin Dashboard

#### Get Dashboard Stats
- **GET** `/api/admin/stats`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Response:**
```json
{
  "stats": {
    "totalOrders": 150,
    "totalRevenue": 25000,
    "totalUsers": 500,
    "totalProducts": 200,
    "ordersByStatus": [...]
  },
  "recentOrders": [...]
}
```

#### Get All Users
- **GET** `/api/admin/users?page=1&limit=10`
- **Headers:** `Authorization: Bearer <admin-token>`

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

Error response format:
```json
{
  "message": "Error description"
}
```

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

Tokens expire after 7 days.

## Database Models

### User
- name, email, password, phone, avatar, role, isEmailVerified

### Product
- name, slug, description, price, discountPrice, image, images, category, brand, stock, rating, reviews, isFeatured

### Category
- name, slug, description, image

### Brand
- name, slug, description, logo

### Cart
- user, items (product, quantity, price), totalPrice

### Order
- user, items, totalPrice, shippingAddress, paymentMethod, paymentStatus, orderStatus, trackingNumber, notes

### Review
- product, user, rating, comment, helpful

### Address
- user, fullName, phone, address, city, postalCode, country, isDefault

### Wishlist
- user, products

### Coupon
- code, discount, discountType, minAmount, maxUses, uses, expiresAt, isActive
