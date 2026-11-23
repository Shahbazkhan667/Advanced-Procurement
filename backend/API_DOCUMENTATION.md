# ProCureX API — Phase 1

Base URL: `http://localhost:5000`. All responses use `{ "success": boolean, "message": string, "data": object|null }`. Authenticated routes require `Authorization: Bearer <accessToken>`. Access tokens use HS256 and are short-lived (15 minutes by default); logout/password changes invalidate all existing tokens by incrementing a server-side token version. Public registration is intentionally not provided, so clients cannot self-assign privileged roles.

## Health

### GET `/health` — public
Response: `{ "success": true, "message": "ProCureX API is healthy", "data": { "status": "ok" } }`

## Authentication

### POST `/api/auth/login` — public
Body: `{ "email": "admin@example.com", "password": "your-password" }`
Success: `{ "success": true, "message": "Login successful", "data": { "accessToken": "<JWT>", "tokenType": "Bearer", "expiresIn": "15m", "user": { "id": "...", "name": "...", "email": "...", "role": "admin", "isActive": true } } }`
Errors: 400 invalid body; 401 invalid credentials or inactive account; 429 rate limited.

### POST `/api/auth/logout` — any authenticated role
Body: none. Response: `{ "success": true, "message": "Logged out successfully", "data": null }`. Invalidates every issued access token for this account.

### GET `/api/auth/me` — any authenticated role
Body: none. Response: `{ "success": true, "message": "Current user", "data": { "user": { "id": "...", "name": "...", "email": "...", "role": "employee", "isActive": true } } }`.

### POST `/api/auth/change-password` — any authenticated role
Body: `{ "currentPassword": "old-password", "newPassword": "a-new-password-at-least-12" }`. Response: success with null data; other sessions are invalidated and sign-in is required again. Incorrect current password: 400.

### POST `/api/auth/forgot-password` — public
Body: `{ "email": "user@example.com" }`. Response is intentionally generic regardless of account existence. If the account exists and SMTP is configured, a random one-time reset token expires in 15 minutes and is emailed. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`; without SMTP, no email is sent.

### POST `/api/auth/reset-password` — public
Body: `{ "token": "<token received by email>", "newPassword": "a-new-password-at-least-12" }`. Token is single-use and expires in 15 minutes. Invalid/expired token: 400. Resets the password and invalidates existing access tokens.

## Phase 1 setup

From `backend/`: `cp .env.example .env`, set a reachable `MONGO_URI`, a unique random `JWT_SECRET` (32+ characters), and `FRONTEND_URL`; then `npm install`, `npm run seed:admin`, and `npm run dev`. Do not commit `.env`. The seeder reads `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` only from the local environment and never prints the password. Keep MongoDB private and use TLS/authentication for hosted databases.

## Thunder Client requests

1. `GET http://localhost:5000/health` — no auth.
2. `POST http://localhost:5000/api/auth/login`, JSON body shown above; copy `data.accessToken`.
3. `GET http://localhost:5000/api/auth/me`, header `Authorization: Bearer <token>`.
4. `POST http://localhost:5000/api/auth/change-password`, same header and JSON body above.
5. `POST http://localhost:5000/api/auth/logout`, same header; subsequent `/me` with the same token should return 401.
6. `POST http://localhost:5000/api/auth/forgot-password`, JSON email; requires SMTP configuration for email delivery.
7. `POST http://localhost:5000/api/auth/reset-password`, JSON token and new password.

## Phase boundary

This implementation includes Phase 1 authentication only. User administration, departments, procurement workflows, approvals, vendors, reporting, and audit APIs are intentionally deferred to Phase 2. No frontend files are changed.
