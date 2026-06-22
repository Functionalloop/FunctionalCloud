# FunctionalBloom

A full-stack e-commerce storefront built with React, TypeScript, Vite, and Firebase. Features a live product shop, cart and checkout flow, order management, an admin panel, and Firebase Authentication with Google Sign-In.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animations | Motion (Framer Motion) |
| Backend / DB | Firebase Firestore |
| Auth | Firebase Auth (Google OAuth) |
| Icons | Lucide React |

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero section and featured products |
| `/shop` | Full product catalogue |
| `/product` | Individual product detail view |
| `/checkout` | Cart review and order placement |
| `/thankyou` | Order confirmation |
| `/story` | Brand story page |
| `/care` | Care instructions |
| `/admin` | Admin panel (restricted) |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- A **Firebase** project with Firestore and Authentication enabled

### 1. Clone and install

```bash
git clone <repo-url>
cd FunctionalBloom
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Open `.env` and set the following keys:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 3. Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check with TypeScript |
| `npm run clean` | Remove `dist/` and `server.js` |

---

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Firestore Database** (start in test mode for development).
3. Enable **Authentication** and turn on the **Google** sign-in provider.
4. Copy your project's web app config into the `.env` file as shown above.

> **Note:** The app will show a setup error screen and refuse to start if Firebase environment variables are missing or invalid.

---

## Project Structure

```
src/
├── components/       # Shared UI components (Navigation, Footer, etc.)
├── pages/            # Route-level page components
├── assets/           # Static assets
├── firebase.ts       # Firebase initialisation and exports
├── types.ts          # Shared TypeScript types
├── App.tsx           # Root component and client-side router
└── index.css         # Global styles and design tokens
```

---

## Contributing

1. Fork the repo and create a feature branch.
2. Make your changes with clear, focused commits.
3. Open a pull request with a short description of what changed and why.

---

## License

MIT
