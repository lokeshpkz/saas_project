# Coderyn - Frontend

A modern React-based frontend for the Coderyn license management system, built with TypeScript, Vite, and shadcn/ui.

## Features

- 🔐 **Complete Authentication System** - Login and registration with JWT tokens
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🛡️ **Protected Routes** - Automatic redirection for unauthenticated users
- 🔄 **Real-time State Management** - Context-based authentication state
- 💳 **Subscription System** - Premium subscriptions with Razorpay integration
- 🚀 **Fast Development** - Hot module replacement with Vite

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see Backend directory)

## Setup Instructions

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your backend API URL and Razorpay Key ID:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Backend Integration

The frontend is fully integrated with the backend API:

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login  
- `GET /api/users/me` - Get current user
- `GET /api/users/logout` - Logout user

### Subscription Endpoints
- `POST /api/subscription/create-order` - Create subscription payment order
- `POST /api/subscription/verify-payment` - Verify subscription payment
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/cancel` - Cancel subscription

### Authentication Flow
1. User enters credentials on `/auth` page
2. Frontend sends request to backend API
3. Backend returns JWT token on success
4. Token is stored in localStorage
5. Protected routes check for valid token
6. User is redirected to dashboard on success

## Subscription System

### Free Plan
- Limited to 2 applications
- Limited to 30 license keys per application
- Basic features

### Premium Plan
- Unlimited applications
- Unlimited license keys per application
- Priority support
- Advanced analytics

### Payment Integration Setup

To enable the payment system, you need to:

1. Create a Razorpay account at https://razorpay.com/
2. Get your API Keys from the Razorpay Dashboard (Settings > API Keys)
3. Update the backend `.env` file with your Razorpay keys:
   ```
   RAZORPAY_KEY_ID=your_actual_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_actual_razorpay_key_secret
   ```
4. Update the frontend `.env` file with your Razorpay Key ID:
   ```
   VITE_RAZORPAY_KEY_ID=your_actual_razorpay_key_id
   ```

### Testing Payments
For testing purposes, you can use Razorpay's test cards:
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: 123
- Name: Any name
- OTP: 123456

Note: In production, make sure to use your actual Razorpay keys and follow all security best practices.

### Payment Integration
- Razorpay payment gateway
- Monthly and yearly subscription options
- Secure payment processing

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AppLayout.tsx   # Main application layout
│   ├── AppSidebar.tsx  # Navigation sidebar
│   └── ProtectedRoute.tsx # Route protection
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state management
│   └── SubscriptionContext.tsx # Subscription state management
├── hooks/              # Custom React hooks
│   └── useSubscription.ts # Subscription data hooks
├── lib/                # Utility libraries
│   ├── api.ts          # API client and types
│   └── toast.ts        # Toast notifications
├── pages/              # Page components
│   ├── Auth.tsx        # Login/Register page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Subscription.tsx # Subscription management
│   └── Profile.tsx     # User profile
└── App.tsx             # Main application component
```

## Key Components

### AuthContext
Manages global authentication state:
- User login/logout
- Token management
- Loading states
- Error handling

### SubscriptionContext
Manages subscription state:
- Current plan information
- Subscription status
- Payment processing

### API Client
Type-safe API client with:
- Automatic token injection
- Error handling
- TypeScript interfaces

### Protected Routes
Automatically redirects unauthenticated users to login page.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication Features

### Login Page
- Email/password authentication
- Form validation
- Loading states
- Error handling

### Registration Page  
- Name, email, password fields
- Password confirmation
- Minimum password length validation
- Real-time validation feedback

### User Profile
- Display user information
- Account creation date
- Role and status information

## Subscription Features

### Dashboard Integration
- Visual indicators for subscription status
- Upgrade prompts for free users
- Usage limits display

### Subscription Management Page
- Current plan details
- Upgrade options
- Payment processing with Razorpay

### License and App Limits
- Automatic enforcement of free plan limits
- Clear messaging about upgrade options

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **date-fns** - Date formatting

## Testing the Integration

1. **Start the Backend**
   ```bash
   cd Backend
   npm install
   npm start
   ```

2. **Start the Frontend**
   ```bash
   npm run dev
   ```

3. **Test Authentication**
   - Navigate to `http://localhost:5173/auth`
   - Try registering a new user
   - Try logging in with existing credentials
   - Check that protected routes redirect to auth when not logged in

4. **Test Subscription Features**
   - Create a free account
   - Navigate to the dashboard to see subscription status
   - Try creating more than 2 apps (should be blocked)
   - Try creating more than 30 licenses per app (should be blocked)
   - Navigate to the subscription page to upgrade

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.