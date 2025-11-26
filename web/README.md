# Social Network Frontend

A beautiful, modern frontend for the Social Network API built with React, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Login and registration with JWT tokens
- **Post Management**: Create, read, update, and delete posts
- **Comments**: Add comments to posts
- **Feed**: Browse posts with search and filtering
- **Responsive Design**: Beautiful UI that works on all devices
- **Role-based Permissions**: Different permissions for admin, moderator, and user roles

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **date-fns** for date formatting

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your backend API URL:
   ```
   VITE_API_URL=http://localhost:8080/v1
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5174`.

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components
│   ├── Posts/          # Post-related components
│   └── UI/             # Generic UI components
├── context/            # React context providers
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── api.ts          # API client
│   ├── auth.ts         # Authentication helpers
│   └── format.ts       # Formatting utilities
└── main.tsx            # Application entry point
```

## API Integration

The frontend integrates with the Social Network Go API and supports:

- User authentication and registration
- CRUD operations for posts
- Comment management
- Feed browsing with search and filters
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request