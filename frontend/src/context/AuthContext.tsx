import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import {
  AppUser,
  UserRole,
  firebaseSignIn,
  firebaseRegister,
  firebaseGoogleSignIn,
  firebaseSendPasswordReset,
  firebaseResendVerification,
  firebaseSignOut,
  getStoredUserRole,
  setStoredUserRole,
} from '../services/firebaseAuth';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  logout: () => Promise<void>;
  fastLogin: (role: UserRole) => Promise<void>;
  updateUserRole: (newRole: UserRole) => void;
  isWorker: boolean;
  isAdmin: boolean;
  isParent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [rawFirebaseUser, setRawFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. If real Firebase is initialized, subscribe to onAuthStateChanged
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const role = getStoredUserRole(fbUser.uid, 'WORKER');
          setRawFirebaseUser(fbUser);
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'User'),
            photoURL: fbUser.photoURL,
            emailVerified: fbUser.emailVerified,
            role,
          });
        } else {
          setRawFirebaseUser(null);
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // 2. Fallback to persisted demo user if in local preview mode
      const savedDemo = localStorage.getItem('poshan_active_demo_user');
      if (savedDemo) {
        try {
          setUser(JSON.parse(savedDemo));
        } catch {
          localStorage.removeItem('poshan_active_demo_user');
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, rememberMe = true) => {
    setLoading(true);
    try {
      const loggedIn = await firebaseSignIn(email, password, rememberMe);
      setUser(loggedIn);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (role: UserRole = 'WORKER') => {
    setLoading(true);
    try {
      const loggedIn = await firebaseGoogleSignIn(role);
      setUser(loggedIn);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'WORKER') => {
    setLoading(true);
    try {
      const newUser = await firebaseRegister(name, email, password, role);
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    await firebaseSendPasswordReset(email);
  };

  const resendVerification = async () => {
    if (rawFirebaseUser) {
      await firebaseResendVerification(rawFirebaseUser);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut();
      setUser(null);
      setRawFirebaseUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fastLogin = async (role: UserRole) => {
    const creds = {
      WORKER: { email: 'worker@poshanmitra.in', password: 'Poshan@123' },
      ADMIN: { email: 'admin@poshanmitra.in', password: 'Admin@123' },
      PARENT: { email: 'parent@poshanmitra.in', password: 'Parent@123' },
    };
    await login(creds[role].email, creds[role].password);
  };

  const updateUserRole = (newRole: UserRole) => {
    if (user) {
      setStoredUserRole(user.uid, newRole);
      setUser({ ...user, role: newRole });
    }
  };

  const isWorker = user?.role === 'WORKER' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';
  const isParent = user?.role === 'PARENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        login,
        loginWithGoogle,
        register,
        forgotPassword,
        resendVerification,
        logout,
        fastLogin,
        updateUserRole,
        isWorker,
        isAdmin,
        isParent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
