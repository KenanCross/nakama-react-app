# Frontend Instructions

## Scope

These instructions apply to everything under `nakama-frontend/`.

Before editing, inspect:

- `package.json`
- `tsconfig.json`
- the build-tool configuration
- existing components related to the task
- existing tests
- frontend environment-variable conventions

## Architecture

- Follow the existing component and feature structure.
- Keep presentation, application state, and API access separated where the
  current architecture supports it.
- Reuse existing components before creating new ones.
- Avoid introducing global state for local component concerns.
- Keep API calls in the repository's existing API or service layer.
- Do not call Firebase services directly from components when an abstraction
  already exists.

## TypeScript

- Preserve strict TypeScript settings.
- Do not use `any` to bypass type errors.
- Use `unknown` for untrusted external values and narrow before use.
- Use type-only imports where supported.
- Do not weaken compiler configuration without approval.
- Keep API response types aligned with backend contracts.

## Components

- Use semantic HTML.
- Use buttons for actions and links for navigation.
- Preserve keyboard accessibility.
- Ensure form controls have accessible labels.
- Handle loading, empty, success, and error states.
- Avoid unnecessary wrapper elements.
- Keep components focused and reasonably small.
- Do not prematurely extract one-use abstractions.

## Styling

- Follow the existing CSS methodology.
- Prefer CSS for responsive behavior rather than JavaScript.
- Preserve existing custom properties, breakpoints, and naming conventions.
- Avoid inline styles unless the project already uses them for dynamic values.
- Respect reduced-motion preferences for nonessential animation.

## Firebase Client Usage

- Use only browser-safe Firebase configuration values.
- Never place administrative credentials or server secrets in frontend code.
- Do not bypass backend authorization with client-side checks.
- Treat client-side authorization checks as user-interface behavior, not
  security enforcement.
- Do not change authentication persistence or provider configuration without
  approval.

## Verification

Run the scripts that exist in `nakama-frontend/package.json`, typically:

- install dependencies only when required
- type checking
- linting
- tests
- production build

Report any UI behavior requiring manual browser verification.
