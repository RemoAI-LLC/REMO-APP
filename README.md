# REMO Web Maintenance Page

This is a standalone maintenance page for REMO-WEB that displays when the main application is under maintenance.

## Features

- Beautiful, responsive maintenance page design
- Animated progress indicators
- Real-time status updates
- Contact information for support
- Waitlist signup option

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Lucide React Icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Deployment

This maintenance page can be deployed to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Cloudflare Pages

## Configuration

The maintenance page includes:

- Estimated maintenance time (currently set to 2-3 hours)
- Progress indicator (currently set to 75%)
- Contact email (support@remo.ai)
- Waitlist signup functionality

You can modify these values in the `src/App.tsx` file.

## Usage

When REMO-WEB needs to go into maintenance mode:

1. Deploy this maintenance page to your hosting service
2. Update your DNS or routing to point to this maintenance page
3. Update the progress and time estimates as needed
4. When maintenance is complete, switch back to the main REMO-WEB application

## Customization

The maintenance page can be customized by:

- Changing the color scheme in `src/index.css` using Tailwind v4's `@theme` directive
- Updating the progress percentage and time estimates
- Modifying the contact information
- Adding additional status indicators
- Customizing the animations and transitions 