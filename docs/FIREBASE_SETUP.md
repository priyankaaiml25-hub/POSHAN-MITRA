# Firebase Authentication & Security Setup Guide for Poshan Mitra

This document provides step-by-step instructions to configure production-ready **Firebase Authentication** and **Firestore Security Rules** for the Poshan Mitra platform.

---

## 1. Create a Firebase Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** (or **Create a Project**).
3. Name your project (e.g., `poshan-mitra-prod` or `poshan-mitra-dev`).
4. (Optional) Enable Google Analytics and click **Create Project**.

---

## 2. Register Your Web Application
1. On your Firebase project dashboard, click the **Web icon (`</>`)** to add an app.
2. Enter an App nickname (e.g., `Poshan Mitra Web`).
3. (Optional) Check "Also set up Firebase Hosting for this app".
4. Click **Register app**.
5. Firebase will display your `firebaseConfig` object containing:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "poshan-mitra-xxx.firebaseapp.com",
     projectId: "poshan-mitra-xxx",
     storageBucket: "poshan-mitra-xxx.appspot.com",
     messagingSenderId: "123456789...",
     appId: "1:123456789:web:abcdef..."
   };
   ```

---

## 3. Configure Frontend Environment Variables
In your project directory, copy the template file to `.env`:
```bash
# In frontend directory
cp .env.example .env
```
Fill in the values copied from your Firebase Console:
```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="poshan-mitra-xxx.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="poshan-mitra-xxx"
VITE_FIREBASE_STORAGE_BUCKET="poshan-mitra-xxx.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

---

## 4. Enable Authentication Sign-In Providers
In the Firebase Console sidebar, select **Build > Authentication**:
1. Click **Get Started**.
2. Under the **Sign-in method** tab:
   - **Email/Password**: Click **Email/Password**, toggle **Enable**, and click **Save**. *(Do not enable Email link passwordless unless specifically desired).*
   - **Google**: Click **Google**, toggle **Enable**, enter a Project support email, and click **Save**.

---

## 5. Configure Authorized Domains
Under **Authentication > Settings > Authorized Domains**:
- `localhost` is authorized by default.
- Add any production deployment domains (e.g. `poshanmitra.web.app` or your custom domain `poshanmitra.in`).

---

## 6. Email Templates (Verification & Password Reset)
Under **Authentication > Templates**:
1. **Password reset**: Customize the sender name (e.g., "Poshan Mitra Support") and reply-to email.
2. **Email address verification**: Customize the subject line ("Verify your email for Poshan Mitra") and message body.

---

## 7. Firestore Security Rules (Child Privacy & RBAC)
If storing user profiles or child records in Cloud Firestore, deploy these strict security rules to prevent unauthorized reads:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Profiles
    match /users/{userId} {
      // Users can only read and write their own profile
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sensitive Child Anthropometric Records (Anganwadi Workers & Admins only)
    match /children/{childId} {
      allow read, write: if request.auth != null && 
        (request.auth.token.role == 'WORKER' || request.auth.token.role == 'ADMIN');
    }
    
    // Growth Measurements
    match /measurements/{measurementId} {
      allow read, write: if request.auth != null && 
        (request.auth.token.role == 'WORKER' || request.auth.token.role == 'ADMIN');
    }

    // Public Educational Content (Read-only for all)
    match /educational_lessons/{lessonId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'ADMIN';
    }
  }
}
```

### Deploying Rules via Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 8. Graceful Fallback Mode in Poshan Mitra
If Firebase environment variables are not yet configured:
- Poshan Mitra will display an informative setup helper banner at the top of the authentication screen.
- A **Quick Preview Demo Mode** is available so that examiners and developers can evaluate the entire web app and role-based workflows before creating their Firebase account.

