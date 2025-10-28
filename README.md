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

```bash
cp .env.example .env
```

Update `.env` with your API URL:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

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

This frontend connects to the FinTrackr Backend API. Make sure the backend is running and the API URL is configured in your `.env` file.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT Licenses.
