# Todo Web

Frontend application for managing todo tasks built with React + TypeScript + Vite.

## Features

- 🔐 Authentication (registration, login)
- ✅ CRUD operations for todo tasks
- 📝 Inline todo editing
- ✨ Modern UI with dark mode support
- 🚀 Minimal dependencies (only react-router)
- 📡 Native Fetch API without additional HTTP clients

## Technologies

- React
- TypeScript
- Vite
- React Router
- Fetch API

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (or copy from `.env.example`):

```bash
VITE_API_URL=http://localhost:3000/api
```

3. Make sure the backend (todo-api) is running on port 3000

4. Start the dev server:

```bash
npm run dev
```

The application will run on `http://localhost:5173`

## Project Structure

```
src/
├── components/      # React components
│   ├── TodoItem.tsx
│   ├── TodoForm.tsx
│   └── ProtectedRoute.tsx
├── contexts/        # React context (AuthContext)
├── hooks/           # Custom hooks
├── lib/             # API client (fetch wrapper)
├── pages/           # Pages (Login, Register, Todos)
├── types/           # TypeScript types
├── App.tsx          # Main component with routing
└── index.css        # Global styles
```

## Production Build

```bash
npm run build
npm run preview
```
