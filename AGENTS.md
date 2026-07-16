# Repository Instructions

## Repository Overview

This repository contains a React frontend, an intended standalone backend, and
experimental Firebase Functions work for cloud deployment evaluation.

- `nakama-frontend/` contains the browser application. 
- `nakama-backend/` contains the intended server-side application and API
  logic.
- `functions/` contains an experimental Firebase Functions implementation.
- The root `firebase.json` defines Firebase Functions configuration.
- `nakama-frontend/firebase.json` defines frontend Firebase Hosting
  configuration and SPA rewrites.

Always inspect the relevant package.json, tsconfig.json, and local AGENTS.md
before modifying either application.

## Working Scope

- Open and reason about the repository from the root.
- Determine whether a task affects the frontend, intended backend,
  experimental Functions code, Firebase configuration, or more than one area.
- Keep changes limited to the affected application unless cross-project
  changes are required.
- Explain cross-project implications before changing both applications.
- Do not assume frontend and backend use the same dependencies, build tools,
  module systems, or coding conventions.

## Firebase Configuration

Do not modify the following without explicit approval:

- `firebase.json`
- `.firebaserc`
- hosting rewrites
- emulator configuration
- deployment targets
- Firebase Functions runtime settings
- Firestore indexes or security rules
- environment or secrets configuration

Before proposing Firebase configuration changes, explain:

1. Why the change is required.
2. Which Firebase service it affects.
3. Whether it changes local development.
4. Whether it changes deployment behavior.
5. Whether manual Firebase Console work is required.

Treat `functions/` as experimental unless the user explicitly asks to promote
or productionize it. `nakama-backend/` is the intended application backend.

## Shared Contracts

- Keep frontend and backend API contracts synchronized.
- Do not change request or response shapes without identifying all consumers.
- Prefer explicit shared types when the repository already has a shared
  package or shared source directory.
- Do not create a shared package solely for one or two trivial types.
- Treat authentication and authorization changes as cross-project changes.

## Package Management

- Preserve the package manager and lock file used by each application.
- Run dependency commands from the appropriate subdirectory.
- Do not add, remove, or upgrade dependencies without approval.
- Do not replace separate package manifests with workspaces unless explicitly
  requested.

## Verification

For frontend-only changes, run the frontend checks.

For backend-only changes, run the `nakama-backend/` checks.

For changes affecting Firebase integration or both applications, run checks
for both projects and explain any emulator or manual verification required.

Before finishing, report:

- frontend files changed
- backend files changed
- root or Firebase files changed
- commands run and their results
- anything not verified
- deployment or migration implications

## Prohibited Actions Without Approval

Do not:

- deploy to Firebase
- alter production data
- change security rules
- change database indexes
- change Firebase project aliases or targets
- modify secrets or real environment values
- change public API contracts
- commit, push, merge, or rewrite Git history
