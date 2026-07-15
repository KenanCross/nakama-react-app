# Backend Instructions

## Scope

These instructions apply to everything under `backend/`.

Before editing, inspect:

- `package.json`
- `tsconfig.json`
- the application entry point
- database connection code
- route or function registration
- validation and error-handling patterns
- existing tests

## Architecture

- Keep transport concerns, business logic, and persistence separated.
- Keep route handlers or Firebase callable functions thin.
- Put application logic in services.
- Put MongoDB access in repositories or the existing data-access layer.
- Follow the repository's existing feature organization.
- Avoid creating generic abstractions for a single use case.

## TypeScript

- Preserve strict TypeScript settings.
- Avoid `any`.
- Use `unknown` for untrusted input.
- Validate external input at runtime.
- Do not use non-null assertions to conceal uncertain state.
- Do not weaken compiler options to make an error disappear.

## MongoDB

- Reuse the application's existing MongoDB client and connection pool.
- Do not create a new MongoClient per request or function invocation.
- Keep database operations inside the established data-access layer.
- Validate IDs before constructing ObjectId instances.
- Do not expose MongoDB documents directly through API responses.
- Map `_id` and internal fields to public response models.
- Use projections when full documents are unnecessary.
- Add pagination to potentially unbounded list queries.
- Do not add, remove, or alter indexes without approval.
- Do not run destructive data operations or migrations without approval.

## Firebase Backend

- Preserve the configured Firebase Functions generation and runtime.
- Account for cold starts and reused function instances.
- Initialize reusable clients outside request handlers when appropriate.
- Do not deploy functions.
- Do not modify IAM, secrets, runtime configuration, regions, memory, timeout,
  or concurrency settings without approval.
- Do not trust user identifiers or roles supplied in request bodies.
- Verify authentication using the established server-side mechanism.
- Enforce authorization on the backend.

## API Contracts

- Validate request bodies, route parameters, query parameters, and headers.
- Return consistent error shapes.
- Do not expose stack traces, database errors, secrets, or internal details.
- Identify all frontend consumers before changing a response shape.
- Preserve backward compatibility unless a breaking change is approved.

## Security and Logging

- Never commit credentials, service-account files, tokens, or connection
  strings.
- Do not log authentication tokens, passwords, or sensitive user data.
- Do not pass unvalidated request objects directly into MongoDB queries.
- Explicitly map allowed filter and update fields.
- Do not silently swallow rejected promises.
- Use the existing structured logger when available.

## Testing and Verification

Run the scripts that exist in `backend/package.json`, typically:

- type checking
- linting
- unit tests
- integration tests
- production build

For database changes, report:

- collections affected
- query behavior
- index implications
- data compatibility
- whether emulator or test-database verification was performed
