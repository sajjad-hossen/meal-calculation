# Authentication Service Documentation

This document explains how authentication, specifically the Access Token and Refresh Token mechanisms, works in the Meal Calculation application.

## Overview

The application uses **JSON Web Tokens (JWT)** for securing API endpoints. Because access tokens are short-lived for security reasons, a **Refresh Token** mechanism is implemented to allow users to stay logged in without needing to re-enter their credentials frequently.

---

## 1. Tokens Explained

### Access Token
- **What it is:** A signed JWT containing user claims (ID, email, role).
- **Lifespan:** Short-lived (expires in **15 minutes**).
- **Purpose:** Included in the `Authorization` header of every protected API request to prove the user's identity to the backend.
- **Backend Code:** Generated in `TokenService.cs` -> `GenerateAccessToken()`.

### Refresh Token
- **What it is:** A secure, randomly generated 64-byte string (Base64 encoded).
- **Lifespan:** Long-lived (expires in **7 days**).
- **Purpose:** Used *only* to request a new Access Token when the current Access Token expires.
- **Storage:** Securely stored in the backend database against the user's record.
- **Backend Code:** Generated in `TokenService.cs` -> `GenerateRefreshToken()`.

---

## 2. Authentication Flows

### A. Login Flow
When a user logs in:
1. **Frontend:** Sends email and password to `/api/auth/login`.
2. **Backend:** Verifies the credentials against the database.
3. **Backend:** If valid, generates an **Access Token** and a **Refresh Token**.
4. **Backend:** Saves the Refresh Token and its 7-day expiry date to the `User` record in the database.
5. **Frontend:** Receives both tokens and saves them in browser `localStorage` (`accessToken` and `refreshToken`).

### B. Standard API Request Flow
For every protected request (e.g., fetching meals):
1. **Frontend:** The Axios **Request Interceptor** (`frontend/src/services/api.ts`) automatically retrieves the `accessToken` from `localStorage`.
2. **Frontend:** Attaches it to the request header: `Authorization: Bearer <accessToken>`.
3. **Backend:** Validates the signature and expiry of the JWT. If valid, the request proceeds.

### C. The Token Refresh Flow (Automatic)
When an Access Token expires, the backend will reject requests with a `401 Unauthorized` status. The frontend handles this seamlessly:
1. **Trigger:** An API request is made, but the Access Token is expired. The backend returns a `401 Unauthorized`.
2. **Frontend Catch:** The Axios **Response Interceptor** (`api.ts`) catches this 401 error.
3. **Queueing:** To prevent multiple parallel refresh requests, the frontend sets an `isRefreshing` flag. Any other API requests made during this time are temporarily paused and placed into a `failedQueue`.
4. **Refresh Request:** The frontend automatically sends the stored `refreshToken` to the `/api/auth/refresh` endpoint.
5. **Backend Validation:** The backend checks if the provided Refresh Token matches the one in the database for that user and ensures it hasn't expired (within 7 days).
6. **Token Rotation:** If valid, the backend generates a **brand new** Access Token AND a **brand new** Refresh Token. The old refresh token is overwritten in the database.
7. **Frontend Update:** The frontend receives the new tokens, updates `localStorage`, and retries the original failed request with the new Access Token. It also processes any other requests that were waiting in the queue.
8. **Failure Handling:** If the refresh token itself is expired or invalid, the backend rejects the refresh request. The frontend clears local storage and forces the user back to the `/login` page.

### D. Logout Flow
1. **Frontend:** User clicks logout. Calls `/api/auth/logout`.
2. **Backend:** Identifies the user from their current token and clears the `RefreshToken` and `RefreshTokenExpiryTime` fields from their database record, effectively invalidating their session.
3. **Frontend:** Removes tokens and user data from `localStorage` and redirects to login.

---

## 3. Key Files

- **`backend/Services/TokenService.cs`**: Contains the cryptographic logic for generating both the JWT Access Token and the random Refresh Token string.
- **`backend/Controllers/AuthController.cs`**: Exposes the `/login`, `/register`, `/refresh`, and `/logout` endpoints. Handles database token storage and validation.
- **`frontend/src/services/authService.ts`**: Frontend methods for calling auth endpoints and managing `localStorage`.
- **`frontend/src/services/api.ts`**: Contains the crucial **Axios Interceptors**. This is where the magic of attaching access tokens to requests and automatically catching 401s to trigger the refresh flow happens.
