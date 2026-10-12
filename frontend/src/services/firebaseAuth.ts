import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';

export type UserRole = 'WORKER' | 'ADMIN' | 'PARENT';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role: UserRole;
  isDemo?: boolean;
}

export function getFirebaseErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email address. Please create an account.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please verify your credentials or reset your password.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters with letters and numbers.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please verify your internet connectivity.';
    case 'auth/too-many-requests':
      return 'Access temporarily restricted due to many failed attempts. Please try again later.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in your Firebase Console. Please enable Email/Password or Google.';
    default:
      return error.message || 'Authentication failed. Please check your credentials.';
  }
}

// Local storage key for user custom role
const ROLE_STORAGE_PREFIX = 'poshan_user_role_';

export function getStoredUserRole(uid: string, defaultRole: UserRole = 'WORKER'): UserRole {
  const stored = localStorage.getItem(`${ROLE_STORAGE_PREFIX}${uid}`);
  if (stored === 'ADMIN' || stored === 'WORKER' || stored === 'PARENT') {
    return stored;
  }
  return defaultRole;
}

export function setStoredUserRole(uid: string, role: UserRole): void {
  localStorage.setItem(`${ROLE_STORAGE_PREFIX}${uid}`, role);
}

// 1. Sign In With Email and Password
export async function firebaseSignIn(email: string, password: string, rememberMe = true): Promise<AppUser> {
  if (!isFirebaseConfigured || !auth) {
    // Fallback demo mode for evaluation
    return handleDemoSignIn(email, password);
  }

  await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const fbUser = userCredential.user;
  const role = getStoredUserRole(fbUser.uid, 'WORKER');

  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName || email.split('@')[0],
    photoURL: fbUser.photoURL,
    emailVerified: fbUser.emailVerified,
    role,
  };
}

// 2. Register With Email, Password, and Full Name
export async function firebaseRegister(name: string, email: string, password: string, role: UserRole = 'WORKER'): Promise<AppUser> {
  if (!isFirebaseConfigured || !auth) {
    return handleDemoRegister(name, email, role);
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const fbUser = userCredential.user;

  // Update Display Name
  await updateProfile(fbUser, { displayName: name });

  // Store Role
  setStoredUserRole(fbUser.uid, role);

  // Send verification email
  try {
    await sendEmailVerification(fbUser);
  } catch (verifyErr) {
    console.warn('Could not send initial verification email:', verifyErr);
  }

  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: name,
    photoURL: fbUser.photoURL,
    emailVerified: fbUser.emailVerified,
    role,
  };
}

// 3. Sign In With Google
export async function firebaseGoogleSignIn(role: UserRole = 'WORKER'): Promise<AppUser> {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    return handleDemoGoogleSignIn(role);
  }

  const userCredential = await signInWithPopup(auth, googleProvider);
  const fbUser = userCredential.user;
  const existingRole = getStoredUserRole(fbUser.uid, role);
  setStoredUserRole(fbUser.uid, existingRole);

  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName || 'Google User',
    photoURL: fbUser.photoURL,
    emailVerified: fbUser.emailVerified,
    role: existingRole,
  };
}

// 4. Send Password Reset Email
export async function firebaseSendPasswordReset(email: string): Promise<void> {
  if (!isFirebaseConfigured || !auth) {
    // Demo simulation
    await new Promise((r) => setTimeout(r, 600));
    return;
  }
  await sendPasswordResetEmail(auth, email);
}

// 5. Resend Verification Email
export async function firebaseResendVerification(user: FirebaseUser): Promise<void> {
  if (!isFirebaseConfigured) {
    return;
  }
  await sendEmailVerification(user);
}

// 6. Sign Out
export async function firebaseSignOut(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  localStorage.removeItem('poshan_active_demo_user');
}

// ---- FALLBACK DEMO SIGN-IN HANDLERS (When .env keys are not yet input) ----
function handleDemoSignIn(email: string, _pass: string): AppUser {
  let role: UserRole = 'WORKER';
  let name = 'Sunita Devi (Anganwadi Worker)';

  if (email.includes('admin')) {
    role = 'ADMIN';
    name = 'Dr. Rajesh Kumar (CDPO District Officer)';
  } else if (email.includes('parent')) {
    role = 'PARENT';
    name = 'Lakshmi M (Parent/Caregiver)';
  } else {
    name = email.split('@')[0];
  }

  const demoUser: AppUser = {
    uid: `demo-${Date.now()}`,
    email,
    displayName: name,
    photoURL: null,
    emailVerified: true,
    role,
    isDemo: true,
  };

  localStorage.setItem('poshan_active_demo_user', JSON.stringify(demoUser));
  return demoUser;
}

function handleDemoRegister(name: string, email: string, role: UserRole): AppUser {
  const demoUser: AppUser = {
    uid: `demo-${Date.now()}`,
    email,
    displayName: name,
    photoURL: null,
    emailVerified: false,
    role,
    isDemo: true,
  };
  localStorage.setItem('poshan_active_demo_user', JSON.stringify(demoUser));
  return demoUser;
}

function handleDemoGoogleSignIn(role: UserRole): AppUser {
  const demoUser: AppUser = {
    uid: 'google-demo-12345',
    email: 'google.user@example.com',
    displayName: 'Aarav Sharma (Google User)',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    emailVerified: true,
    role,
    isDemo: true,
  };
  localStorage.setItem('poshan_active_demo_user', JSON.stringify(demoUser));
  return demoUser;
}

