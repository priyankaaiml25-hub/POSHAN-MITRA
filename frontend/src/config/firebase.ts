import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if credentials are provided and not default template placeholders
export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'poshan-mitra-project'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured) {
  try {
    const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    app = firebaseApp;
    auth = getAuth(firebaseApp);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      void isSupported()
        .then((supported) => {
          if (supported) analytics = getAnalytics(firebaseApp);
        })
        .catch((error) => console.warn('Firebase Analytics is unavailable:', error));
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Auth SDK:', error);
  }
} else {
  console.warn(
    'ℹ️ Firebase environment variables not detected in .env. Poshan Mitra is running in Guided Setup / Demo Mode.'
  );
}

export { app, auth, googleProvider, analytics };

