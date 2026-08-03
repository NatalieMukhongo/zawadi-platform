# Zawadi Platform

A React app built with [Vite](https://vite.dev/), Tailwind CSS, and Firebase.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode with hot module reloading.
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm test`

Runs the test suite (via [Vitest](https://vitest.dev/)).

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run preview`

Serves the production build locally, to sanity-check it before deploying.

## Environment variables

Firebase config is read from `.env` (not committed) using `VITE_*`-prefixed
variables — see `src/firebase/config.js` for the full list.
