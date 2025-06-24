# RemoAI Agents Frontend

![RemoAI Logo](public/MainLogo.png)

## Overview

The **RemoAI Agents Frontend** is a modern, cross-platform desktop and web application built with React, TypeScript, Vite, and TailwindCSS. It serves as the main interface for interacting with RemoAI's suite of AI-powered agents, supporting both web and Electron desktop environments.

## Features
- **Dual Platform**: Runs as a web app and as a desktop app (Electron).
- **Modern UI**: Built with React, TailwindCSS, and modular components.
- **Authentication**: Integrated with Privy for email, wallet, and Google login.
- **Internationalization**: Multi-language support using i18next.
- **Responsive Design**: Mobile-friendly and dark mode support.
- **Routing**: Client-side routing with React Router.
- **Reusable Components**: Modular structure for easy extension.
- **Showcase & Integrations**: Use case demos and integration pages.

## Folder Structure
```
agents-frontend/
├── public/                # Static assets (images, icons, etc.)
├── src/
│   ├── assets/            # Images, SVGs, and other assets
│   ├── components/        # Reusable React components (Sidebar, Topbar, Layout, etc.)
│   ├── context/           # React context providers
│   ├── pages/             # Main page components (Home, Usecases, SmartApply, Integrations, Usage)
│   ├── routes/            # App route definitions
│   ├── utils/             # Utility functions (e.g., isElectron)
│   └── ...
├── desktop/               # Electron main process and certs
├── scripts/               # Helper scripts (cert generation, etc.)
├── package.json           # Project metadata and scripts
├── vite.config.ts         # Vite build configuration
├── tsconfig*.json         # TypeScript configuration
└── README.md              # Project documentation
```

## Main Pages & Routes
- `/` or `/home` - **Home**: Landing page with main features and navigation.
- `/usecases` - **Usecases**: Showcases of AI agent use cases.
- `/SmartApply` - **Smart Apply**: AI-powered job application workflow.
- `/integrations` - **Integrations**: Integration options and guides.

## Visuals & Assets
- Main logo: `public/MainLogo.png`
- Animated and static assets: `src/assets/`

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
```bash
# Install dependencies
npm install
# or
yarn install
```

### Development (Web)
```bash
npm run dev:web
# or
yarn dev:web
```

### Development (Desktop/Electron)
```bash
npm run dev:desktop
# or
yarn dev:desktop
```

### Build for Production (Web)
```bash
npm run build:web
# or
yarn build:web
```

### Build for Production (Desktop/Electron)
```bash
npm run build:desktop
# or
yarn build:desktop
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## Environment Variables
Create a `.env` file in the root with the following (see `.env.example` if available):
```
VITE_PRIVY_APP_ID=your-privy-app-id
```

## Tech Stack
- **React** (with hooks)
- **TypeScript**
- **Vite** (build tool)
- **TailwindCSS** (utility-first CSS)
- **Electron** (desktop app)
- **React Router** (routing)
- **i18next** (internationalization)
- **Privy** (authentication) 

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---

> _RemoAI Agents Frontend — Your gateway to AI-powered productivity, on web and desktop._

The End!!!
