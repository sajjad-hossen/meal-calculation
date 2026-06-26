# Password Reset Flow

This document explains the end-to-end process of the Password Reset feature, covering how the frontend, backend, database, and SMTP work together.

## 🌟 Real-Life Example: The "Lost Keys" Scenario

Imagine you lost the keys to your house (forgot your password).
1. **Frontend**: You go to the locksmith's website and enter your address, saying "I need new keys" (Forgot Password page).
2. **Backend**: The locksmith (Backend) checks their records to ensure you actually live there.
3. **Database**: The records book (Database) confirms your address.
4. **SMTP**: The locksmith mails a temporary lockbox code (OTP or Reset Token) via the postal service (SMTP) to your secure mailbox.
5. **Frontend**: You receive the mail, take the code, and go back to the locksmith's website to set a new permanent key (Reset Password page).
6. **Backend & Database**: The locksmith verifies the code, creates your new key, and updates their records.

---

## 🏗️ System Architecture

### 1. Frontend (React/Next.js/etc.)
- **Forgot Password Page**: Provides a form for the user to input their email address.
- **Verification Page**: (Optional depending on flow) Prompts the user to enter an OTP sent to their email.
- **Reset Password Page**: Provides a form for the user to enter their new password and confirm it. This page usually includes the reset token in the URL (e.g., `/reset-password?token=xyz123`).

### 2. Backend (C# .NET API)
- **Generate Token/OTP**: Generates a secure, cryptographically random token or a 6-digit OTP when a reset is requested.
- **Send Email**: Interfaces with an SMTP server to send the reset link/OTP to the user's email.
- **Validate Token/OTP**: Checks if the token/OTP is valid and hasn't expired when the user tries to set a new password.
- **Update Password**: Hashes the new password and updates the user's record in the database.

### 3. Database (SQL Server/PostgreSQL/MySQL)
Stores the user's data and the temporary reset token.
- `Users` Table: Contains user credentials.
- `PasswordResetTokens` Table (or columns in `Users` table):
  - `ResetToken`: The hashed token or OTP.
  - `TokenExpiry`: The timestamp when the token expires (e.g., 15 minutes after generation).

### 4. SMTP (Simple Mail Transfer Protocol)
SMTP is the protocol used to send email messages across the internet.
- The backend acts as an SMTP Client.
- It connects to an SMTP Server (like SendGrid, Gmail, AWS SES).
- It provides credentials (username/password/API key) to authenticate.
- It sends the email payload (To, From, Subject, HTML Body) containing the reset link or OTP.

---

## 🔄 The Step-by-Step Flow

### Step 1: User Requests Password Reset
1. **User** enters their email on the Frontend and clicks "Reset Password".
2. **Frontend** sends a `POST /api/auth/forgot-password` request with the email to the Backend.

### Step 2: Backend Generates Token & Updates Database
1. **Backend** checks the **Database** to see if a user with that email exists.
   - *Security Note*: Always return a generic success message ("If an account exists, an email has been sent") to prevent email enumeration attacks.
2. If the user exists, **Backend** generates a unique Token (or OTP) and sets an Expiry Time (e.g., 15 minutes).
3. **Backend** saves the Token and Expiry Time in the **Database**.

### Step 3: Backend Sends Email via SMTP
1. **Backend** connects to the **SMTP Server** using the configured credentials in `appsettings.json` or environment variables.
2. **Backend** composes an email containing a link: `https://your-app.com/reset-password?token=abc-123-xyz&email=user@example.com` (or just the OTP).
3. **SMTP Server** delivers the email to the user's inbox.

### Step 4: User Clicks Link & Enters New Password
1. **User** opens the email and clicks the link.
2. **Frontend** reads the `token` and `email` from the URL parameters.
3. **User** enters their new password and clicks "Submit".
4. **Frontend** sends a `POST /api/auth/reset-password` request with the `email`, `token`, and `newPassword`.

### Step 5: Backend Validates & Updates Database
1. **Backend** queries the **Database** for the user and the associated token.
2. **Backend** checks two things:
   - Does the token match?
   - Is the current time before the `TokenExpiry`?
3. If valid, the **Backend** hashes the `newPassword`.
4. **Backend** updates the user's password in the **Database** and nullifies/deletes the used token so it cannot be used again.
5. **Backend** responds with a `200 OK` success message.
6. **Frontend** redirects the user to the Login page.
