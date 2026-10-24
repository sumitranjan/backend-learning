# 11 — Permissions

This project builds on the authentication and refresh-token rotation examples. It demonstrates **permission-based authorization**: authenticate a request, read the user's role from the access token, then check whether that role has the permission required by the route.

## The mental model

```text
Request
  → authenticate (verify Bearer access token; attach claims to req.user)
  → authorizePermission("resource:action") (role → permission lookup)
  → controller (perform the operation)
```

Authentication answers **“Who is making this request?”** Authorization answers **“May this user perform this action?”** A missing or invalid access token returns **401 Unauthorized**. A valid identity without the required permission returns **403 Forbidden**.

## Roles and permissions

The source of truth is `src/config/permissions.js` (`ROLE_PERMISSIONS`). The role is stored on the user and included in the access-token claims.

| Role | Permissions |
| --- | --- |
| `admin` | `user:read`, `user:create`, `user:update`, `user:delete`, `report:read`, `report:create` |
| `manager` | `user:read`, `user:update`, `report:read` |
| `user` | `profile:read`, `profile:update` |

`hasPermission(role, requiredPermission)` looks up the role's permission list and checks membership with `includes`. An unknown role gets an empty list and is denied by default. Keep permission names consistent: `user:read` and `profile:read` are separate permissions.

## Where authorization happens

`src/middleware/authorize.middleware.js` exports two middleware factories:

- `authorizeRoles("admin", ...)` checks a role directly.
- `authorizePermission("user:read")` checks the role-to-permission mapping. This is the approach used by the user routes.

Protected route order matters: `authenticate` must run before the authorization middleware because it sets `req.user`.

| Method and path | Required permission | Intended access |
| --- | --- | --- |
| `GET /api/users/me` | `profile:read` | Any user with profile read permission |
| `GET /api/users` | `user:read` | Admin or manager |
| `GET /api/users/:id` | `user:read` | Admin or manager |
| `DELETE /api/users/:id` | `user:delete` | Admin |

The controller still handles resource-level outcomes, such as returning 404 when a user ID does not exist. Permission middleware controls whether the request can reach that controller at all.

## Permission check, step by step

Example: a manager requests `GET /api/users`.

1. **The route selects the policy.** In `src/routes/user.routes.js`, this route is registered with `authenticate` followed by `authorizePermission("user:read")`, then `getUsers`. Calling `authorizePermission` creates middleware with `"user:read"` captured as its required permission.
2. **The client supplies an access token.** It sends `Authorization: Bearer <accessToken>` with the request.
3. **Authentication verifies identity.** `authenticate` checks the header format and verifies the JWT signature, expiry, issuer, and audience via `verifyAccessToken`. If verification succeeds, the decoded payload (including `sub`, `name`, and `role`) is assigned to `req.user`. If it fails, the request ends with 401; authorization and the controller do not run.
4. **Authorization reads the role and required permission.** The permission middleware calls `hasPermission(req.user.role, requiredPermission)`. For this request that is `hasPermission("manager", "user:read")`.
5. **The policy map decides.** `hasPermission` gets `ROLE_PERMISSIONS.manager` and checks whether that array includes `"user:read"`. It does, so the middleware calls `next()`.
6. **The controller handles the operation.** `getUsers` queries MongoDB and returns the users. If the role does not have the permission, authorization returns 403 and `getUsers` is never called.

```text
GET /api/users + Bearer access token
       │
       ▼
authenticate ── invalid/missing token ──► 401
       │ valid; req.user.role = "manager"
       ▼
authorizePermission("user:read")
       │ hasPermission("manager", "user:read")
       ├── false ──► 403
       │ true
       ▼
getUsers ──► query database and return response
```

The role used at authorization time comes from the JWT claim, not a fresh database lookup on every request. It is copied into the access token when login generates that token. Therefore, role changes generally take effect when a new access token is issued (or when the existing token expires), unless the application adds a server-side role lookup or token revocation strategy.

## Try the flow

Start the server after configuring the environment (see below):

```bash
npm install
npm run dev
```

Register, then log in. Registration accepts `name`, `email`, and `password`; the model defaults the role to `user`.

```http
POST /api/auth/register
Content-Type: application/json

{"name":"Asha","email":"asha@example.com","password":"example-password"}
```

```http
POST /api/auth/login
Content-Type: application/json

{"email":"asha@example.com","password":"example-password"}
```

Login returns an access token in the response body and sets the refresh token in an HTTP-only cookie. Send the access token to protected routes as `Authorization: Bearer <accessToken>`. For example, a regular `user` should be able to call `/api/users/me`, but should receive 403 from `/api/users`.

## Token and refresh-token notes

- Access tokens expire after 15 minutes and carry `sub`, `name`, and `role` claims. Authentication verifies the token and puts the decoded claims on `req.user`.
- Refresh tokens are random opaque strings. The database stores a SHA-256 hash, a family ID, expiry, and rotation/revocation metadata; raw refresh tokens are placed in an HTTP-only cookie.
- Refreshing rotates the token: the old token is marked used and a replacement is created in the same family. Reuse of an already-used or revoked token revokes the remaining active family members.
- `cookie-parser` is installed before the auth routes so controllers can read cookies from `req.cookies`.

## Environment

`server.js` loads `.env` with `dotenv`. Configure at least:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/permissions
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
```

The issuer and audience have development defaults in `src/utils/jwt.js` (`auth-dev` and `api-dev`).

## Revision checklist

1. Identify the request's `Authorization` header and trace token verification.
2. Find where `req.user` is assigned and note which claims it contains.
3. Follow the route middleware order: authentication first, permission check second, controller last.
4. Find the role in `ROLE_PERMISSIONS`, then check whether the required permission is present.
5. Remember the status split: **401** means no valid authentication; **403** means authenticated but not allowed.
6. Distinguish broad permission checks from ownership checks. This example's `/me` uses the token subject; a future `GET /:id` policy might also need to verify that the requested ID is allowed for that user.

## Code review reminders

- `registerUser` currently accepts a `role` supplied by the registration body. In a real service, do not let public sign-up choose privileged roles; assign the default role server-side and provide a separately protected role-management path.
- The refresh cookie is named `refresh-token` in login and refresh. The logout controller currently reads/clears `refreshToken` instead, so align the name and cookie options for logout to revoke the same token.
- `revokeRefreshToken` currently uses `new date()`; JavaScript's constructor is `new Date()`. Fix this before relying on logout revocation.
- The permission map currently has `profile:update`, but no profile-update route yet. Likewise, `user:create` and report permissions are examples for future routes.

## File map

- `src/config/permissions.js` — role-to-permission policy.
- `src/middleware/authenticate.middleware.js` — verifies access tokens and sets `req.user`.
- `src/middleware/authorize.middleware.js` — role and permission checks.
- `src/routes/user.routes.js` — attaches policies to user endpoints.
- `src/controllers/user.controller.js` — user/profile operations.
- `src/services/refreshToken.service.js` and `src/models/refreshToken.modal.js` — refresh-token rotation state.
