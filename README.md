# FinTrackr Frontend

A comprehensive personal finance tracker frontend built with React, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Transaction Management**: Full CRUD operations for financial transactions
- **Real-time Dashboard**: Visual analytics with charts and spending insights
- **Category Management**: Organize transactions with custom categories
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Type-Safe**: Built with TypeScript for reliability

## 🛠️ Tech Stack

- **Framework**: React 18+ with Vite
- **Language**: TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 20+ LTS
- npm or yarn

## 🛠️ Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/fintrackr-frontend.git
cd fintrackr-frontend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:

```bash
# .env file
VITE_API_URL=http://localhost:3000/api/v1
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

**Important**: 
- Make sure your backend API is running at the configured URL. The default URL is `http://localhost:3000/api/v1`.
- For Google OAuth, get your Google Client ID from [Google Cloud Console](https://console.cloud.google.com/) and add it to the `.env` file.

4. Start the development server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Common components (Layout)
│   ├── dashboard/      # Dashboard charts and visualizations
│   ├── transactions/   # Transaction management components
│   └── ui/            # Reusable UI components (shadcn/ui)
├── lib/
│   ├── api.ts         # API client configuration
│   └── utils.ts       # Utility functions
├── pages/             # Page components
├── store/             # Zustand state management
├── types/             # TypeScript type definitions
└── App.tsx            # Main application component
```

## 🔐 Authentication

The app uses JWT-based authentication with refresh tokens:

- Access tokens are stored in memory
- Refresh tokens are stored securely
- Automatic token refresh on 401 responses
- Protected routes require authentication

## 📊 Features in Detail

### Dashboard
- Financial overview with key metrics
- Interactive charts for spending analysis
- Category-wise breakdown
- Recent transaction list

### Transactions
- Add income and expense transactions
- Edit and delete transactions
- Filter and search functionality
- Transaction history

### Categories
- Create custom categories
- Category statistics
- Color-coded organization

## 🔗 Backend Integration

This frontend is fully connected to the [FinTrackr Backend API](https://github.com/your-username/fintrackr-backend). 

### Prerequisites

1. **Backend API must be running** - Ensure the backend server is running on `http://localhost:3000` (or update `VITE_API_URL` in `.env`)

2. **Environment Variables** - Set the API URL in your `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   ```

### API Endpoints Used

The frontend uses the following backend endpoints (fully integrated):

#### Authentication
- `POST /api/v1/auth/register` - User registration ✅
- `POST /api/v1/auth/login` - User login ✅
- `GET /api/v1/auth/google` - Google OAuth (redirect-based) ✅
- `POST /api/v1/auth/refresh` - Refresh access token ✅
- `POST /api/v1/auth/logout` - User logout ✅
- `/auth/callback` - OAuth callback handler ✅

#### User
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/dashboard` - Get dashboard data

#### Transactions
- `GET /api/v1/transactions` - Get all transactions (paginated with filters) ✅
- `POST /api/v1/transactions` - Create transaction ✅
- `GET /api/v1/transactions/:id` - Get specific transaction ✅
- `PUT /api/v1/transactions/:id` - Update transaction ✅
- `DELETE /api/v1/transactions/:id` - Delete transaction ✅
- `GET /api/v1/transactions/summary` - Get transaction summary (with date filters) ✅

#### Categories
- `GET /api/v1/categories` - Get all categories (with type filter) ✅
- `POST /api/v1/categories` - Create category ✅
- `GET /api/v1/categories/:id` - Get specific category ✅
- `PUT /api/v1/categories/:id` - Update category ✅
- `DELETE /api/v1/categories/:id` - Delete category ✅
- `GET /api/v1/categories/:id/stats` - Get category statistics (with date filters) ✅

### Authentication Flow

1. User logs in → Receives access token and refresh token
2. Access token is stored in localStorage and sent with each request
3. On 401 response → Automatically attempts to refresh token
4. If refresh fails → User is redirected to login page

### CORS Configuration

**IMPORTANT**: Your backend CORS must be configured to allow `http://localhost:5173` (frontend), NOT `http://localhost:3000` (backend).

Make sure your backend has CORS configured:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL (Vite default)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

**Backend `.env` configuration:**
```env
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed integration testing and troubleshooting instructions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.
