import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../services/firebaseAuth';
import { Sprout, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center animate-bounce shadow-md">
          <Sprout className="w-7 h-7 text-emerald-300" />
        </div>
        <p className="text-sm font-semibold text-charcoal-secondary animate-pulse">
          Verifying secure session...
        </p>
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated user to login while preserving target path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-rose-200 shadow-md text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-charcoal-primary">
          Access Restricted
        </h2>
        <p className="text-xs text-charcoal-secondary leading-relaxed">
          Your current role (<strong>{user.role}</strong>) does not have authorization to view this protected Anganwadi workflow.
        </p>
        <div className="pt-2">
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

