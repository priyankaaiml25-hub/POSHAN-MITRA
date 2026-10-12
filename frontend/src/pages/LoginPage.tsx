import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import poshanLogo from '../../../logo/Poshan Mitra_ Healthy Food, Happy Children.png';
import { useAuth } from '../context/AuthContext';
import { getFirebaseErrorMessage } from '../services/firebaseAuth';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Heart,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, isFirebaseConfigured, fastLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle('WORKER');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFastDemoLogin = async (role: 'WORKER' | 'ADMIN' | 'PARENT') => {
    setError(null);
    setLoading(true);
    try {
      await fastLogin(role);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-[85vh] flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#f2f6ec_0%,#fffdf7_52%,#fff2dc_100%)] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-forest-700 via-forest-500 to-saffron-500" />
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-[#e4e8dc] bg-white shadow-[0_24px_70px_-24px_rgba(20,83,45,0.25)] grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img
                src={poshanLogo}
                alt="Poshan Mitra: Healthy Food, Happy Children"
                className="h-14 w-14 rounded-full object-cover ring-2 ring-forest-100 shadow-sm"
              />
              <div>
                <span className="block text-sm font-black uppercase tracking-[0.12em] text-forest-800">
                  Poshan Mitra
                </span>
                <span className="text-xs font-medium text-charcoal-secondary">Healthy food, happy children</span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-charcoal-primary tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-charcoal-secondary mt-2">
              Sign in to continue to your account.
            </p>
          </div>

          {/* Setup / Demo Notification if Firebase is in development mode */}
          {!isFirebaseConfigured && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  Firebase Setup Mode (Local Evaluation)
                </span>
                <Link to="/docs" className="underline text-[11px] font-semibold text-amber-800">
                  Setup Guide
                </Link>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900">
                To link production Firebase Auth, supply your keys in <code>frontend/.env</code>. For immediate evaluation, click any demo account below:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleFastDemoLogin('WORKER')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-[11px] font-bold hover:bg-amber-100 transition shadow-2xs"
                >
                  Anganwadi Worker
                </button>
                <button
                  type="button"
                  onClick={() => handleFastDemoLogin('ADMIN')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-[11px] font-bold hover:bg-amber-100 transition shadow-2xs"
                >
                  CDPO Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleFastDemoLogin('PARENT')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-[11px] font-bold hover:bg-amber-100 transition shadow-2xs"
                >
                  Parent / Caregiver
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-3 transition shadow-sm focus:ring-2 focus:ring-forest-800"
          >
            {/* Official Google SVG Logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or sign in with email
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-sm font-bold text-charcoal-primary">
            <div>
              <label htmlFor="login-email" className="block mb-2 font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  id="login-email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 bg-slate-50/60 font-medium text-sm transition focus:bg-white focus:ring-2 focus:ring-forest-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 font-semibold text-slate-700">
                <label htmlFor="login-password">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-forest-800 hover:text-forest-900 font-semibold text-xs"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 bg-slate-50/60 font-medium text-sm transition focus:bg-white focus:ring-2 focus:ring-forest-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 font-medium text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-forest-800 focus:ring-forest-800 w-4 h-4"
                />
                <span className="text-[11px]">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-charcoal-secondary pt-2">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-forest-800 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Right Column: Nutrition Brand Visual (5 cols) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-white p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-b from-saffron-400 via-saffron-500 to-forest-500"></div>

          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>POSHAN Abhiyaan 2.0 Aligned</span>
            </div>
            <h2 className="text-2xl font-black leading-tight tracking-tight text-white">
              Better Nutrition. Brighter Futures.
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Empowering Anganwadi workers, caregivers, and preschool children with practical local diet planning, validated WHO growth screening, and interactive learning.
            </p>
          </div>

          <div className="relative z-10 flex justify-center py-5">
            <img
              src={poshanLogo}
              alt="Poshan Mitra logo"
              className="h-48 w-48 rounded-full object-cover border-4 border-white/80 shadow-2xl shadow-black/20 xl:h-52 xl:w-52"
            />
          </div>

          {/* Testimonial / Highlight */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2 relative z-10">
            <div className="flex items-center gap-1 text-saffron-400">
              <Heart className="w-4 h-4 fill-saffron-400" />
              <span className="text-[11px] font-bold text-white">Grassroots Impact</span>
            </div>
            <p className="text-[11px] text-emerald-50 leading-relaxed italic">
              "Poshan Mitra turns complicated growth charts into clear, actionable advice for mothers and field workers."
            </p>
          </div>

          <div className="text-[10px] text-emerald-300/80 border-t border-white/10 pt-4 relative z-10">
            © 2026 Poshan Mitra • Privacy-Conscious Child Welfare
          </div>
        </div>
      </div>
    </div>
  );
};
