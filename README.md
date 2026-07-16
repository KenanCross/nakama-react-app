# Nakama React App

This repository contains a React frontend, a canonical Node/Express backend,
and experimental Firebase Functions work for future cloud deployment options.

## Repository Structure

- `nakama-frontend/` - Vite, React, and TypeScript browser application.
- `nakama-backend/` - intended application backend using Node.js, Express,
  TypeScript, and MongoDB.
- `functions/` - experimental Firebase Functions implementation. Treat this as
  cloud deployment research until a production deployment direction is chosen.
- `firebase.json` and `.firebaserc` - root Firebase Functions configuration.
- `nakama-frontend/firebase.json` and `nakama-frontend/.firebaserc` - frontend
  Firebase Hosting configuration.

There is no root npm workspace or root `package.json`. Run npm commands from
the relevant subdirectory.

## Current Backend Direction

`nakama-backend/` is the intended backend for the application.

The frontend currently calls the backend directly at `http://localhost:3000`.
Whether production traffic should use the standalone backend, Firebase
Functions, or another deployment model still needs further evaluation.

## Prerequisites

- Node.js and npm.
- A MongoDB connection string.
- Firebase CLI only when working with Firebase Hosting or experimental
  Functions flows.

## Environment Variables

The backend expects:

```bash
MONGODB_URI=<your MongoDB connection string>
PORT=3000
```

`PORT` is optional because the backend defaults to `3000`.

Do not commit real environment files, credentials, service account files, or
connection strings.

## Local Development

Install dependencies separately in each active project.

### Frontend

```bash
cd nakama-frontend
npm install
npm run dev
```

The Vite dev server normally runs at `http://localhost:5173`.

### Backend

```bash
cd nakama-backend
npm install
npm run dev
```

The backend normally runs at `http://localhost:3000` and connects to MongoDB
before accepting requests.

## Frontend To Backend Communication

The frontend currently uses hardcoded local backend URLs such as:

```text
http://localhost:3000/api/reviews/
http://localhost:3000/api/reviews/:id
http://localhost:3000/api/reviews/post
```

There is not yet a documented production API base URL, Vite proxy, or
environment-variable based API configuration.

## Firebase

Firebase is currently for cloud operations and deployment exploration.

### Root Firebase Configuration

The root `firebase.json` configures Firebase Functions from `functions/`.
The root `.firebaserc` points to the Firebase project currently associated with
that configuration.

### Frontend Firebase Hosting

`nakama-frontend/firebase.json` configures Hosting with:

- public directory: `dist`
- SPA rewrite: `**` to `/index.html`

`nakama-frontend/.firebaserc` points to the frontend Hosting Firebase project.

### Experimental Functions

The `functions/` directory is experimental. It should not be treated as the
canonical backend until its route contracts, MongoDB lifecycle, environment
configuration, and deployment model are reviewed.

Useful commands:

```bash
cd functions
npm install
npm run build
npm run serve
```

Do not deploy Firebase Functions until the deployment target and production
configuration are confirmed.

## Build And Verification Commands

### Frontend

```bash
cd nakama-frontend
npm run lint
npm run build
npm run preview
```

### Backend

```bash
cd nakama-backend
npm run build
npm run start
```

### Functions

```bash
cd functions
npm run build
```

## Missing Verification Coverage

The repository does not currently provide:

- root-level npm scripts
- frontend tests
- backend tests
- Functions tests
- backend lint script
- separate typecheck scripts
- documented production API base URL strategy

Until those are added, verification is limited to the scripts that exist in
each package.

## Production Planning Notes

Before production deployment, decide:

1. Whether the production backend is `nakama-backend/`, Firebase Functions, or
   another deployment target.
2. Whether the two Firebase projects should remain separate.
3. How frontend builds should discover the production API base URL.
4. How MongoDB secrets should be managed in production.
5. How authentication and authorization should be implemented.
6. Which verification scripts are required before deployment.
