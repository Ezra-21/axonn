# Axon - Frontend

A modern e-commerce frontend built with Next.js 14, TypeScript, and Tailwind CSS for the Axon backend API.

## Features

### 🔐 Authentication
- User registration and login
- JWT token management with automatic refresh
- Secure token storage in localStorage
- Protected routes with automatic redirects
- Password change functionality

### 🛍️ Shopping Experience
- Product browsing with pagination
- Advanced product filtering (category, price, stock)
- Product search functionality
- Product details with image gallery
- Related products suggestions
- Featured and new arrival products

### 🛒 Shopping Cart
- Add/remove items from cart
- Update item quantities
- Real-time cart count in header
- Cart persistence across sessions
- Cart state management with Context API

### 📦 Order Management
- Complete checkout process
- Multiple payment methods (Stripe, Cash on Delivery, Bank Transfer, Mobile Payment)
- Address management (add, edit, delete)
- Order history with filters
- Order status tracking
- Order cancellation (for eligible orders)

### 👤 User Profile
- Profile information management
- Address book management
- Password change
- Order history access

### 🎨 UI/UX
- Responsive design (mobile, tablet, desktop)
- Clean and modern interface
- Loading states and error handling
- Toast notifications for user feedback
- Sticky header with search
- Product badges (Featured, New, Sale, Out of Stock)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Payment Processing**: Stripe (ready for integration)

## Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   ├── auth/                    # Authentication pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── products/                # Product pages
│   │   ├── page.tsx            # Products list
│   │   └── [slug]/page.tsx     # Product detail
│   ├── cart/page.tsx            # Shopping cart
│   ├── checkout/page.tsx        # Checkout process
│   ├── orders/                  # Order pages
│   │   ├── page.tsx            # Orders list
│   │   └── [id]/page.tsx       # Order detail
│   └── profile/page.tsx         # User profile
├── components/                   # Reusable components
│   ├── auth/                    # Auth components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── cart/                    # Cart components
│   │   └── CartItem.tsx
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Providers.tsx
│   ├── orders/                  # Order components
│   │   └── OrderCard.tsx
│   └── products/                # Product components
│       ├── ProductCard.tsx
│       ├── ProductGrid.tsx
│       └── ProductFilters.tsx
├── lib/                         # Core library code
│   ├── api/                     # API clients
│   │   ├── client.ts           # Axios instance with interceptors
│   │   ├── auth.ts             # Auth API calls
│   │   ├── products.ts         # Products API calls
│   │   ├── cart.ts             # Cart API calls
│   │   ├── orders.ts           # Orders API calls
│   │   ├── user.ts             # User API calls
│   │   ├── payments.ts         # Payments API calls
│   │   └── index.ts            # API exports
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── CartContext.tsx     # Cart state
│   ├── hooks/                   # Custom React hooks
│   │   ├── useProtectedRoute.ts
│   │   └── index.ts
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts
│   └── utils/                   # Utility functions
│       └── storage.ts          # LocalStorage helpers
├── .env.local                   # Environment variables
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies

```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (default: http://localhost:5000)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Update `.env.local` with your backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## API Integration

The frontend communicates with the backend API using Axios. All API calls are organized in the `lib/api/` directory.

### API Client Features

- **Automatic Authentication**: Access token is automatically added to requests
- **Token Refresh**: Expired tokens are automatically refreshed
- **Error Handling**: Centralized error handling with user-friendly messages
- **Request Interceptors**: Modify requests before they're sent
- **Response Interceptors**: Handle responses and errors globally

### Example API Call

```typescript
import { productsApi } from '@/lib/api';

// Fetch all products with filters
const products = await productsApi.getAll({
  page: 1,
  limit: 12,
  category: 'living-room',
  minPrice: 100,
  maxPrice: 1000,
  inStock: true,
});
```

## State Management

### Authentication Context

Manages user authentication state and provides auth methods:

```typescript
const { user, isAuthenticated, login, register, logout } = useAuth();
```

### Cart Context

Manages shopping cart state and provides cart methods:

```typescript
const { 
  cart, 
  itemCount, 
  totalAmount, 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart 
} = useCart();
```

## Protected Routes

Routes that require authentication use the `useProtectedRoute` hook:

```typescript
export default function ProfilePage() {
  useProtectedRoute(); // Redirects to /auth/login if not authenticated
  // ... component code
}
```

## Key Features Implementation

### 1. Authentication Flow

- User registers/logs in → Receives access and refresh tokens
- Tokens stored in localStorage
- Access token sent with every API request
- When access token expires → Automatically refresh using refresh token
- If refresh fails → Clear auth and redirect to login

### 2. Shopping Cart

- Add products to cart (requires authentication)
- Update quantities with stock validation
- Remove items with confirmation
- Clear entire cart
- Cart persists across sessions
- Real-time cart count in header

### 3. Checkout Process

- Select/add delivery address
- Choose payment method
- Add order notes (optional)
- Review order summary
- Place order → Creates order in backend
- If Stripe payment → Redirect to payment page
- Otherwise → Redirect to order confirmation

### 4. Product Browsing

- Grid/list view of products
- Filter by category, price, stock status
- Search by name/description
- Pagination support
- Sort options
- Product badges (Featured, New, Sale)

## Environment Variables

```env
# Backend API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe Publishable Key (optional, for Stripe payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Backend API Endpoints Used

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/change-password` - Change password

### Products
- `GET /products` - Get all products (with filters)
- `GET /products/search` - Search products
- `GET /products/featured` - Get featured products
- `GET /products/new-arrivals` - Get new arrivals
- `GET /products/:id` - Get product by ID
- `GET /products/slug/:slug` - Get product by slug
- `GET /products/:id/related` - Get related products
- `GET /products/categories/all` - Get all categories

### Cart
- `GET /cart` - Get user's cart
- `GET /cart/count` - Get cart item count
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:itemId` - Update cart item
- `DELETE /cart/items/:itemId` - Remove item from cart
- `DELETE /cart` - Clear cart

### Orders
- `POST /orders` - Create new order
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get order by ID
- `PUT /orders/:id/cancel` - Cancel order

### User
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/addresses` - Get user addresses
- `POST /users/addresses` - Add new address
- `PUT /users/addresses/:id` - Update address
- `DELETE /users/addresses/:id` - Delete address

### Payments
- `GET /payments/config` - Get Stripe config
- `POST /payments/create-intent` - Create payment intent
- `GET /payments/order/:orderId` - Get payment by order ID

## Troubleshooting

### API Connection Issues

If you're having trouble connecting to the backend:

1. Verify backend is running: `http://localhost:5000/api/health`
2. Check `.env.local` has correct API URL
3. Check browser console for CORS errors
4. Ensure backend has CORS enabled for `http://localhost:3000`

### Authentication Issues

If you're getting unauthorized errors:

1. Clear localStorage: `localStorage.clear()`
2. Log in again
3. Check token expiration times in backend
4. Verify JWT secret matches between frontend/backend

### Build Issues

If build fails:

1. Delete `.next` folder: `rm -rf .next`
2. Delete `node_modules`: `rm -rf node_modules`
3. Reinstall dependencies: `npm install`
4. Build again: `npm run build`

## Future Enhancements

- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Advanced search with filters
- [ ] Order tracking with real-time updates
- [ ] Email notifications
- [ ] Social login (Google, Facebook)
- [ ] Product comparison
- [ ] Recently viewed products
- [ ] Guest checkout
- [ ] Multi-currency support
- [ ] Dark mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is part of the Axon e-commerce platform.

## Support

For support, please contact the development team or create an issue in the repository.
