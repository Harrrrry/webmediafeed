Login Flow Code Review — Findings

Date: 2025-10-07
Reviewer: GitHub Copilot

Summary
- This document lists findings for the login/auth flow (frontend ↔ backend), with exact file locations and short recommended fixes.
- Priorities: Critical (fix ASAP), High, Medium, Low.

End-to-end flow (brief)
- Frontend UI components dispatch Redux thunks that call the API wrapper `frontend/src/services/api.ts`.
- Thunks: `frontend/src/features/users/authSlice.ts` (regular login, `loginWithShaadiCode`).
- Backend endpoints: `backend/src/modules/users/users.controller.ts` exposing `/users/login`, `/users/login-shaadi`, `/users/join-shaadi`. Auth service implements logic in auth module.

Files referenced (key locations)
- Frontend API wrapper: frontend/src/services/api.ts
- Frontend auth slice (thunks & reducer): frontend/src/features/users/authSlice.ts
- Frontend persistence hook: frontend/src/hooks/useReduxPersistence.ts
- Frontend login components & hooks:
  - frontend/src/components/Login/index.tsx
  - frontend/src/components/Login/ShaadiCodeLogin/useShaadiCodeLogin.ts
  - frontend/src/pages/Login.tsx
- Backend users controller: backend/src/modules/users/users.controller.ts
- Backend app module & overall structure: backend/src/app.module.ts

Findings and recommendations

1) Inconsistent localStorage key usage — Critical
- Problem: Multiple keys used to persist token:
  - Read in auth slice: `localStorage.getItem('token')` (frontend/src/features/users/authSlice.ts)
  - Set in loginWithShaadiCode: `localStorage.setItem('token', ...)` (frontend/src/features/users/authSlice.ts)
  - useReduxPersistence writes `localStorage.setItem('authToken', auth.token)` (frontend/src/hooks/useReduxPersistence.ts)
- Impact: Token may be missing or duplicated; UI may not detect auth state correctly.
- Fix: Choose one key (recommended: 'token') and update all files to use it. Update `useReduxPersistence` to use 'token' and remove `authToken` usage.
- Files to change:
  - frontend/src/hooks/useReduxPersistence.ts
  - frontend/src/features/users/authSlice.ts
  - frontend/src/services/api.ts (reads 'token')

2) Backend throws generic Error instead of HttpExceptions — High
- Example: `loginWithShaadiCode` in backend/src/modules/users/users.controller.ts does `throw new Error('6-digit code is required')` and maps other errors to generic Error.
- Impact: Wrong HTTP status codes (500) and inconsistent client error handling.
- Fix: Replace generic errors with NestJS exceptions (BadRequestException, UnauthorizedException). Use DTO validation to avoid manual length checks.
- Files to change:
  - backend/src/modules/users/users.controller.ts
  - add DTOs with class-validator if not present

3) Missing DTO validation (class-validator) — High
- Problem: DTO classes are present but lack validation decorators. Global ValidationPipe is mentioned in docs but controller code relies on manual checks.
- Recommendation: Define DTOs (LoginDto, LoginShaadiDto, JoinShaadiDto) with class-validator decorators and enable global ValidationPipe in `main.ts`.
- Files to change:
  - backend/src/modules/users/users.controller.ts (replace inline DTOs with decorated DTOs)
  - backend/src/main.ts (enable ValidationPipe globally)

4) Inconsistent thunk return shapes — Medium
- Problem: `login` returns only token string, while `loginWithShaadiCode` returns an object with token, user, shaadi, role, flags (frontend/src/features/users/authSlice.ts).
- Impact: Consumers of thunks must handle different shapes; potential bugs in reducers/components.
- Recommendation: Standardize API response contracts. Create TypeScript interfaces for responses in `frontend/src/utils/interfaces/user.ts` and use them in thunks and reducers.
- Files to change:
  - frontend/src/features/users/authSlice.ts
  - frontend/src/services/api.ts
  - frontend components that consume thunk results (useShaadiCodeLogin, Login page)

5) Token lifecycle & security — Medium → High
- Problem: Token persisted in localStorage (XSS risk). No refresh token flow visible in code base.
- Recommendation: Implement refresh token mechanism (httpOnly refresh cookie + access token short TTL) or rotate refresh tokens stored server-side. Use sessions (ER diagram has USER_SESSION) to support logout/revoke.
- Files/areas to plan:
  - backend auth service and controllers (auth module)
  - frontend auth flows and api wrapper

6) Centralized 401 handling & logout — Medium
- Problem: `frontend/src/services/api.ts` throws errors for non-ok responses but does not centrally handle 401 to trigger logout/redirect.
- Recommendation: Add logic to detect 401 and dispatch logout or clear token + navigate to login.
- Files to change:
  - frontend/src/services/api.ts
  - frontend/src/features/users/authSlice.ts (logout reducer exists)

7) Error parsing in API wrapper — Low/Medium
- Observation: `api.request` reads response text and attempts JSON.parse; this is OK but brittle. Consider normalizing error payloads from backend (e.g., { message, code }).
- Recommendation: Standardize error shape; return structured rejectWithValue in thunks.
- Files: frontend/src/services/api.ts, backend global exception filter

8) Tests coverage suggestions — Low/Medium
- Good: e2e tests exist that assert login token returned (backend/test/app.e2e-spec.ts and others).
- Add unit tests for `authSlice` thunks and reducers, negative cases for shaadi-code login, and integration tests for invalid/expired invite codes.
- Files to add/update: frontend tests under frontend/src/components/Login and frontend/src/features/users

9) Typing and any usage — Low
- Problem: Many `any` usages and untyped responses. Strongly type request/response interfaces.
- Files: frontend/src/services/api.ts, frontend/src/features/users/authSlice.ts, components

Concrete minimal changes I can implement now (pick one)
- Fix localStorage key inconsistency across frontend files (safe, small change)
- Convert `loginWithShaadiCode` controller to use HttpExceptions and a small DTO with validation (example backend change)

Tell me which change to implement first. If you choose the storage-key fix I will update:
- frontend/src/hooks/useReduxPersistence.ts
- frontend/src/features/users/authSlice.ts
- frontend/src/services/api.ts (if needed)

End.
