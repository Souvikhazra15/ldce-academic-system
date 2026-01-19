/*
================================
GOOGLE OAuth CONFIGURATION GUIDE
================================

STEP 1: Get Your Google Client ID
----------------------------------
1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing one)
3. Enable the Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID (Web Application)
5. Add authorized redirect URIs:
   - http://localhost:5173
   - http://localhost:3000
   - https://yourdomain.com
6. Copy the CLIENT ID

STEP 2: Update LoginPage.jsx
----------------------------
Open src/pages/LoginPage.jsx and replace:
   <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">

WITH:
   <GoogleOAuthProvider clientId="YOUR_ACTUAL_CLIENT_ID">

STEP 3: Configure Allowed College Domains
------------------------------------------
In LoginPage.jsx, update the ALLOWED_DOMAINS array:

const ALLOWED_DOMAINS = ['@yourdomain.edu', '@college.ac.in'];

Add all college email domain endings to allow faculty from those domains.

STEP 4: (Optional) Connect to Backend
--------------------------------------
To verify tokens on the backend and establish sessions:

1. In LoginPage.jsx, send token to backend for verification:
   const response = await fetch('/api/auth/verify-token', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ token: credentialResponse.credential })
   });

2. Backend should verify token signature with Google and create session

STEP 5: Test the Application
----------------------------
1. npm start
2. You should see the login page
3. Click "Sign in with Google"
4. Login with a college domain email
5. On success, you'll be redirected to Dashboard

TROUBLESHOOTING
---------------
Issue: "Invalid Client ID"
Fix: Ensure CLIENT_ID matches exactly what's in Google Cloud Console

Issue: "Redirect URI mismatch"
Fix: Add your app's URL to authorized redirect URIs in Google Cloud Console

Issue: "Invalid Domain"
Fix: Make sure the email domain is included in ALLOWED_DOMAINS array

SECURITY NOTES
--------------
✓ Tokens are verified on client side via JWT decode
✓ Store sensitive data like tokens in localStorage (can be enhanced to secure cookies)
✓ Always verify tokens server-side in production
✓ Use HTTPS in production only
✓ Domain validation happens on both client and server (recommended)

FACULTY EXPERIENCE
------------------
1. User lands on login page
2. Clicks "Sign in with Google" button
3. Google authentication dialog opens
4. User selects their Google account (or logs in)
5. System verifies it's a college domain email
6. User is logged in and redirected to Dashboard
7. Navbar shows faculty name and profile
8. Faculty can click "Logout" in user menu to exit

PERSISTENT LOGIN
----------------
Faculty remains logged in even after:
- Refreshing the page
- Closing and reopening the browser
- Any navigation within the app

Logout only happens when:
- Faculty clicks "Logout" in navbar user menu
- AuthToken expires (add expiration check as needed)
*/
