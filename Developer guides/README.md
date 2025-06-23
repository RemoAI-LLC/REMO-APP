# Remo Frontend Developer Guide

This guide covers the React/TypeScript frontend application for the Remo AI Assistant.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup and Installation](#setup-and-installation)
4. [Project Structure](#project-structure)
5. [Key Components](#key-components)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Styling and UI](#styling-and-ui)
9. [Routing](#routing)
10. [Environment Configuration](#environment-configuration)
11. [Development Workflow](#development-workflow)
12. [Building and Deployment](#building-and-deployment)
13. [Testing](#testing)
14. [Troubleshooting](#troubleshooting)

## Overview

The Remo frontend is a modern React application built with TypeScript, Vite, and Tailwind CSS. It provides a beautiful, responsive interface for interacting with the Remo AI Assistant.

### Key Features

- **Modern React**: Built with React 18 and TypeScript
- **Fast Development**: Vite for lightning-fast builds
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Electron Support**: Desktop app capability
- **Real-time Chat**: Live conversation with AI assistant
- **Professional UI**: Clean, modern interface

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User          │    │   React App     │    │   Remo API      │
│   Interface     │◄──►│   (Frontend)    │◄──►│   (Backend)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   State         │
                       │   Management    │
                       └─────────────────┘
```

### Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **React Router**: Navigation
- **Context API**: State management
- **Fetch API**: HTTP requests

## Setup and Installation

### Prerequisites

```bash
# Node.js 18+
node --version

# npm or yarn
npm --version
```

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd REMO-APP

# Install dependencies
npm install

# Start development server
npm run dev:web
```

### Available Scripts

```json
{
  "scripts": {
    "dev:web": "vite",
    "dev:electron": "vite --mode electron",
    "build:web": "tsc && vite build",
    "build:electron": "tsc && vite build && electron-builder",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

## Project Structure

```
REMO-APP/
├── public/                 # Static assets
│   ├── MainLogo.png       # Main logo
│   └── favicon.ico        # Favicon
├── src/
│   ├── assets/            # Images and static files
│   │   ├── Blogs/         # Blog images
│   │   ├── Usecases/      # Use case images
│   │   ├── Logo.svg       # Logo SVG
│   │   └── index.d.ts     # Asset type definitions
│   ├── components/        # Reusable components
│   │   ├── Layout.tsx     # Main layout component
│   │   ├── Sidebar.tsx    # Sidebar navigation
│   │   └── Topbar.tsx     # Top navigation bar
│   ├── context/           # React context providers
│   │   └── LanguageContext.tsx
│   ├── pages/             # Page components
│   │   ├── Home.tsx       # Home page
│   │   ├── Integrations.tsx
│   │   ├── SmartApply.tsx
│   │   ├── Usage.tsx
│   │   └── Usecases.tsx
│   ├── routes/            # Routing configuration
│   │   └── index.tsx
│   ├── utils/             # Utility functions
│   │   └── isElectron.ts
│   ├── App.tsx            # Main app component
│   ├── App.css            # App styles
│   ├── index.css          # Global styles
│   ├── main.tsx           # App entry point
│   └── env.d.ts           # Environment type definitions
├── desktop/               # Electron-specific files
│   ├── main.ts            # Electron main process
│   ├── certs/             # SSL certificates
│   └── tsconfig.json
├── scripts/               # Build scripts
│   ├── copy-certs.js
│   └── generate-certs.js
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── electron-builder.json  # Electron build configuration
└── README.md
```

## Key Components

### App Component

```typescript
// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import AppRoutes from "./routes";

function App() {
  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
}

export default App;
```

### Layout Component

```typescript
// src/components/Layout.tsx
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
```

### Chat Interface

```typescript
// Example chat component structure
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const ChatComponent = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const sendMessage = async (message: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversation_history: state.messages,
        }),
      });

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: "user", content: message, timestamp: new Date() },
          { role: "assistant", content: data.response, timestamp: new Date() },
        ],
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to send message",
        isLoading: false,
      }));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {state.messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <MessageInput onSend={sendMessage} disabled={state.isLoading} />
      </div>
    </div>
  );
};
```

## State Management

### Context API Usage

```typescript
// src/context/LanguageContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState("en");

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
```

### Custom Hooks

```typescript
// src/hooks/useChat.ts
import { useState, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (message: string) => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            conversation_history: messages,
          }),
        });

        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          { role: "user", content: message },
          { role: "assistant", content: data.response },
        ]);
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return { messages, isLoading, sendMessage };
};
```

## API Integration

### API Service

```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ChatRequest {
  message: string;
  conversation_history: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export interface ChatResponse {
  response: string;
  success: boolean;
  error: string | null;
}

export class ApiService {
  static async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
}
```

### Error Handling

```typescript
// src/utils/errorHandler.ts
export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return "Authentication failed. Please check your credentials.";
      case 403:
        return "Access denied. You don't have permission to perform this action.";
      case 404:
        return "Resource not found. Please check the URL.";
      case 429:
        return "Too many requests. Please wait before trying again.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return error.message;
    }
  }

  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "Network error. Please check your connection.";
  }

  return "An unexpected error occurred. Please try again.";
};
```

## Styling and UI

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
```

### Component Styling

```typescript
// Example of styled component
const Button = ({
  children,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

## Routing

### Route Configuration

```typescript
// src/routes/index.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Integrations from "../pages/Integrations";
import SmartApply from "../pages/SmartApply";
import Usage from "../pages/Usage";
import Usecases from "../pages/Usecases";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/integrations" element={<Integrations />} />
      <Route path="/smart-apply" element={<SmartApply />} />
      <Route path="/usage" element={<Usage />} />
      <Route path="/usecases" element={<Usecases />} />
    </Routes>
  );
};

export default AppRoutes;
```

### Navigation Component

```typescript
// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Integrations", href: "/integrations", icon: IntegrationIcon },
  { name: "Smart Apply", href: "/smart-apply", icon: SmartApplyIcon },
  { name: "Usage", href: "/usage", icon: UsageIcon },
  { name: "Use Cases", href: "/usecases", icon: UsecasesIcon },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4">
          <img src="/MainLogo.png" alt="Remo" className="h-8" />
        </div>

        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
```

## Environment Configuration

### Environment Variables

```typescript
// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Environment Files

```bash
# .env.development
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=Remo AI Assistant (Dev)
VITE_APP_VERSION=1.0.0

# .env.production
VITE_API_URL=https://remo-server.onrender.com
VITE_APP_TITLE=Remo AI Assistant
VITE_APP_VERSION=1.0.0
```

### Configuration Service

```typescript
// src/config/index.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  appTitle: import.meta.env.VITE_APP_TITLE || "Remo AI Assistant",
  appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export const validateConfig = () => {
  const required = ["apiUrl"];

  for (const key of required) {
    if (!config[key as keyof typeof config]) {
      throw new Error(
        `Missing required environment variable: VITE_${key.toUpperCase()}`
      );
    }
  }
};
```

## Development Workflow

### Development Commands

```bash
# Start development server
npm run dev:web

# Start with Electron
npm run dev:electron

# Build for production
npm run build:web

# Build Electron app
npm run build:electron

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Quality

```json
// .eslintrc.json
{
  "extends": ["@typescript-eslint/recommended", "react-hooks/recommended"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Git Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## Building and Deployment

### Web Build

```bash
# Build for production
npm run build:web

# The build output will be in the dist/ directory
# Deploy the contents to your hosting provider
```

### Electron Build

```bash
# Build Electron app
npm run build:electron

# This will create executables in the dist-electron/ directory
```

### Deployment Platforms

#### Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build:web",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build:web"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build:web
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Testing

### Unit Testing

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../Button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing

```typescript
// src/__tests__/Chat.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatComponent } from "../components/Chat";

// Mock API
jest.mock("../services/api", () => ({
  ApiService: {
    chat: jest.fn(),
  },
}));

describe("Chat Component", () => {
  it("sends message and displays response", async () => {
    const mockResponse = {
      response: "Hello! How can I help you?",
      success: true,
    };
    ApiService.chat.mockResolvedValue(mockResponse);

    render(<ChatComponent />);

    const input = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.getByText("Send");

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(
        screen.getByText("Hello! How can I help you?")
      ).toBeInTheDocument();
    });
  });
});
```

### E2E Testing

```typescript
// cypress/integration/chat.spec.ts
describe("Chat Functionality", () => {
  it("should send a message and receive a response", () => {
    cy.visit("/");

    cy.get('[data-testid="chat-input"]').type("Hello Remo");
    cy.get('[data-testid="send-button"]').click();

    cy.get('[data-testid="message-list"]')
      .should("contain", "Hello Remo")
      .and("contain", "Hello! How can I help you?");
  });
});
```

## Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist .vite
```

#### TypeScript Errors

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix type issues
npx tsc --noEmit --pretty
```

#### API Connection Issues

```typescript
// Check API connectivity
const checkApiHealth = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/health`);
    const data = await response.json();
    console.log("API Health:", data);
  } catch (error) {
    console.error("API Health Check Failed:", error);
  }
};
```

#### Development Server Issues

```bash
# Kill all Node processes
pkill -f node

# Clear port 5173
lsof -ti:5173 | xargs kill -9

# Restart development server
npm run dev:web
```

### Performance Optimization

```typescript
// Lazy load components
import { lazy, Suspense } from "react";

const LazyComponent = lazy(() => import("./HeavyComponent"));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);

// Memoize expensive components
import { memo } from "react";

const ExpensiveComponent = memo(({ data }) => {
  // Expensive rendering logic
  return <div>{/* component content */}</div>;
});
```

### Debugging

```typescript
// Add debug logging
const DEBUG = import.meta.env.DEV;

export const debugLog = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Use in components
debugLog("Chat message sent", { message, timestamp: new Date() });
```

---

**For more information, see the main README and API integration guide! 🚀**
