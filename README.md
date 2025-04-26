# School Payment Portal - Frontend

The frontend for the School Payment Portal application, built with React.js, Tailwind CSS, and Vite.

## Features

- **Dashboard**: View transaction statistics and a comprehensive list of all transactions
- **School-specific Transactions**: Filter transactions by school
- **Transaction Status Check**: Verify the status of any transaction
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Authentication**: Secure login and registration

## Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images and other assets
│   │   ├── DarkModeToggle.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   ├── config/         # Configuration files
│   │   └── index.js    # Constants and app configuration
│   ├── context/        # React context providers
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── ThemeContext.jsx # Dark/light mode
│   ├── pages/          # Application pages
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── SchoolTransactions.jsx
│   │   ├── TransactionStatus.jsx
│   │   └── ...
│   ├── services/       # API service functions
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   └── transaction.service.js
│   ├── utils/          # Utility functions
│   │   ├── darkModeStyles.js
│   │   └── transactionUtils.js
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
└── package.json        # Dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with:

```
VITE_API_URL=http://localhost:8000/api
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Pages and Features

### Dashboard

The main dashboard displays:

- Transaction statistics (total counts, amounts)
- Paginated table of all transactions
- Filters for status and date range
- Sorting options for all columns
- Pagination controls

### School Transactions

This page allows:

- Selecting a specific school from a dropdown
- Viewing all transactions for the selected school
- Filtering and sorting the school-specific transactions
- Pagination for large result sets

### Transaction Status

This page provides:

- A form to enter transaction/order ID
- Detailed display of transaction information when found
- Status indicators with appropriate colors
- Error handling for invalid IDs

### Authentication

Authentication features include:

- Login form with error handling
- Test login functionality for development
- Secure route protection
- JWT token storage and management

## State Management

The application uses React Context API for state management:

- `AuthContext`: Manages user authentication state
- `ThemeContext`: Manages dark/light mode preference

## API Integration

API services are organized in the `services` directory:

- `api.js`: Base Axios setup with interceptors
- `auth.service.js`: Authentication-related API calls
- `transaction.service.js`: Transaction-related API calls

## Styling

The application uses Tailwind CSS for styling with:

- Custom utility functions for dark/light mode in `utils/darkModeStyles.js`
- Responsive design for all screen sizes
- Consistent design language throughout

## Error Handling

The application implements comprehensive error handling:

- API request errors are caught and displayed to the user
- Loading states provide feedback during asynchronous operations
- Fallback content for when data is not available
