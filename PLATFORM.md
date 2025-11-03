# Redefine Auth Platform Documentation

## Overview

Redefine Auth is a comprehensive authentication and license management system designed for software developers and businesses. It provides a complete solution for managing user authentication, application licensing, and subscription billing.

## Key Features

### 1. User Management
- Secure user registration and authentication
- JWT-based session management
- Password hashing with bcrypt
- User profile management

### 2. Application Management
- Create and manage multiple applications
- Application version tracking
- Application pausing functionality
- Access control based on ownership

### 3. License System
- Generate and validate license keys
- Hardware ID binding for security
- License expiration management
- Usage tracking and analytics

### 4. Reseller System
- Register resellers for applications
- Reseller-specific license creation
- License allocation controls
- Reseller management dashboard

### 5. Subscription Management
- Free and premium subscription tiers
- Razorpay payment integration
- Monthly and yearly billing options
- Subscription status tracking

### 6. End-User Management
- End-user registration and authentication
- License validation for end-users
- Hardware ID verification
- Account banning capabilities

## Architecture

### Frontend
- Built with React 18 and TypeScript
- Vite for fast development and building
- shadcn/ui components with Tailwind CSS
- React Router for navigation
- React Query for server state management

### Backend
- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- JWT for authentication
- Razorpay for payment processing
- RESTful API design

### Security
- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Hardware ID binding for licenses
- Role-based access control

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- React Query
- date-fns
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Razorpay
- express-validator

## Setup and Installation

### Prerequisites
- Node.js 18+
- MongoDB database
- Razorpay account for payment processing

### Frontend Setup
1. Navigate to project root directory
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```
4. Start development server: `npm run dev`

### Backend Setup
1. Navigate to Backend directory
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`:
   ```
   JWT_SECRET=your_jwt_secret_key
   MONGO_URI=your_mongodb_connection_string
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
4. Start the server: `npm start`

## Development Guidelines

### Frontend Development
- Use TypeScript for type safety
- Follow component-based architecture
- Utilize React hooks for state management
- Implement proper error handling
- Use Tailwind CSS for styling

### Backend Development
- Follow REST API principles
- Use Express.js middleware for authentication
- Implement proper error handling with custom error responses
- Use Mongoose for database operations
- Implement input validation

### Code Quality
- ESLint for code linting
- Proper code documentation
- Consistent naming conventions
- Modular code organization

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user
- `GET /api/users/logout` - Logout user

### Applications
- `GET /api/apps` - Get user's applications
- `POST /api/apps` - Create new application
- `PUT /api/apps/:id` - Update application
- `DELETE /api/apps/:id` - Delete application

### Licenses
- `POST /api/licenses/validate` - Validate license key
- `GET /api/licenses` - Get all licenses
- `GET /api/licenses/app/:appId` - Get app licenses
- `POST /api/licenses/app/:appId` - Create licenses
- `PUT /api/licenses/:id` - Update license
- `DELETE /api/licenses/:id` - Delete license

### Resellers
- `POST /api/resellers/login` - Reseller login
- `GET /api/resellers/me` - Get reseller info
- `POST /api/resellers/:id/licenses` - Create licenses
- `GET /api/resellers/:id/licenses` - Get licenses

### Subscriptions
- `POST /api/subscription/create-order` - Create payment order
- `POST /api/subscription/verify-payment` - Verify payment
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/cancel` - Cancel subscription

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Subscription System

### Free Plan
- 2 applications
- 30 license keys per application
- 1 reseller
- Basic support

### Premium Plan
- Unlimited applications
- Unlimited license keys per application
- Unlimited resellers
- Priority support
- Advanced analytics

### Payment Integration

To enable the payment system:

1. Create a Razorpay account at https://razorpay.com/
2. Get your API Keys from the Razorpay Dashboard (Settings > API Keys)
3. Update environment variables:
   - Frontend: `VITE_RAZORPAY_KEY_ID`
   - Backend: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

### Testing Payments
For development and testing, use Razorpay's test cards:
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: 123
- Name: Any name
- OTP: 123456

## Troubleshooting

### Common Issues

1. **Payment Processing Errors**
   - Ensure Razorpay keys are correctly configured in environment variables
   - Check network connectivity to Razorpay servers
   - Verify subscription plan prices in the database

2. **License Validation Failures**
   - Check license key format
   - Verify license expiration dates
   - Confirm application is not paused
   - Check hardware ID binding

3. **Authentication Issues**
   - Verify JWT secret is properly configured
   - Check if user account exists
   - Ensure password is correct

4. **Database Connection Problems**
   - Verify MongoDB connection string
   - Check if MongoDB service is running
   - Ensure network connectivity to database

### Debugging Tips

1. Check server logs for error messages
2. Use browser developer tools to inspect API requests
3. Verify environment variables are correctly set
4. Test API endpoints with tools like Postman