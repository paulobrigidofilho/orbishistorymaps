# Admin API Reference

Complete API documentation for admin routes in the Orbis e-commerce platform.

## Authentication

All admin routes require authentication and admin role. Use session-based authentication with `requireAdmin` middleware.

## User Management

### Get All Users (Paginated)
```
GET /api/admin/users
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `search` (optional) - Search by name or email
- `role` (optional) - Filter by role: `user` or `admin`
- `status` (optional) - Filter by status: `active`, `inactive`, or `suspended`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z",
      "avatar_url": "http://localhost:4000/uploads/avatars/avatar.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Get Single User
```
GET /api/admin/users/:userId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "status": "active",
    "phone": "021234567",
    "address": "123 Main St",
    "city": "Auckland",
    "state": "Auckland",
    "zipCode": "1010",
    "country": "New Zealand",
    "created_at": "2024-01-01T00:00:00.000Z",
    "avatar_url": "http://localhost:4000/uploads/avatars/avatar.jpg"
  }
}
```

### Update User Status
```
PATCH /api/admin/users/:userId/status
```

**Request Body:**
```json
{
  "status": "active" // or "inactive", "suspended"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": { /* updated user object */ }
}
```

### Update User Role
```
PATCH /api/admin/users/:userId/role
```

**Request Body:**
```json
{
  "role": "admin" // or "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": { /* updated user object */ }
}
```

## Product Management

### Get All Products (Paginated)
```
GET /api/admin/products
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `search` (optional) - Search by product name or SKU
- `category_id` (optional) - Filter by category ID
- `is_active` (optional) - Filter by active status: `true` or `false`
- `is_featured` (optional) - Filter by featured status: `true` or `false`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "product_name": "Product Name",
      "product_description": "Description",
      "slug": "product-name",
      "price": "99.99",
      "sale_price": "79.99",
      "sku": "PROD-001",
      "quantity_available": 50,
      "category_id": 1,
      "is_featured": true,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Get Single Product
```
GET /api/admin/products/:productId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "product_name": "Product Name",
    "product_description": "Description",
    "slug": "product-name",
    "price": "99.99",
    "sale_price": "79.99",
    "sku": "PROD-001",
    "quantity_available": 50,
    "category_id": 1,
    "is_featured": true,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "images": [
      {
        "image_id": 1,
        "image_url": "http://localhost:4000/uploads/products/product-large-123.jpg",
        "is_primary": true
      }
    ]
  }
}
```

### Create Product
```
POST /api/admin/products
```

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "sale_price": 79.99,
  "sku": "PROD-001",
  "quantity_available": 50,
  "category_id": 1,
  "is_featured": false,
  "is_active": true
}
```

**Required Fields:**
- `name` (string, 3-200 characters)
- `price` (number, min: 0.01)
- `quantity_available` (integer, min: 0)

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { /* created product object */ }
}
```

### Update Product
```
PATCH /api/admin/products/:productId
```

**Request Body (all fields optional):**
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 109.99,
  "sale_price": 89.99,
  "sku": "PROD-001-V2",
  "quantity_available": 75,
  "category_id": 2,
  "is_featured": true,
  "is_active": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { /* updated product object */ }
}
```

### Delete Product (Soft Delete)
```
DELETE /api/admin/products/:productId
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "productId": 1,
    "deleted": true
  }
}
```

## Product Image Management

### Upload Product Image
```
POST /api/admin/products/:productId/images
```

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `image`
- Optional field: `isPrimary` (string: "true" or "false")

**Supported formats:** JPEG, JPG, PNG, WebP  
**Max file size:** 10MB

**Image Sizes Generated:**
- Thumbnail: 150x150px (max 20KB)
- Small: 300x300px (max 50KB)
- Medium: 800x800px (max 150KB)
- Large: 1500x1500px (max 400KB)

**Response:**
```json
{
  "success": true,
  "message": "Product image uploaded successfully",
  "data": {
    "imageId": 1,
    "imageUrl": "http://localhost:4000/uploads/products/product-large-123.jpg",
    "isPrimary": true,
    "sizes": {
      "thumbnail": "product-thumbnail-123.jpg",
      "small": "product-small-123.jpg",
      "medium": "product-medium-123.jpg",
      "large": "product-large-123.jpg"
    }
  }
}
```

### Delete Product Image
```
DELETE /api/admin/products/images/:imageId
```

**Response:**
```json
{
  "success": true,
  "message": "Product image deleted successfully",
  "data": {
    "imageId": 1,
    "deleted": true
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message description"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (not admin)
- `404` - Not Found
- `409` - Conflict (duplicate SKU)
- `500` - Internal Server Error

## Security Notes

1. All routes require admin authentication via `requireAdmin` middleware
2. Admins cannot modify their own role or status
3. All inputs are validated using Joi schemas
4. Product images are automatically compressed to multiple sizes
5. Soft delete used for products (sets `is_active = false`)
6. Session-based authentication with secure cookies
