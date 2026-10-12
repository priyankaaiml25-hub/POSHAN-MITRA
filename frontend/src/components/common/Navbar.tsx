import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import type { Language } from '../../i18n/translations';
import {
  Menu,
  X,
  Sprout,
  BookOpen,
  Apple,
  Calculator,
  Gamepad2,
  TrendingUp,
  Landmark,
  User,
  LogOut,
  Globe,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  FileBarChart2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: t('navHome'), path: '/' },
    { name: t('navEducation'), path: '/education', icon: BookOpen },
    { name: t('navFoodGuide'), path: '/food-guide', icon: Apple },
    { name: t('navMealPlanner'), path: '/meal-planner', icon: Calculator },
    { name: t('navPoshanPlay'), path: '/poshan-play', icon: Gamepad2 },
    { name: t('navGovtSchemes'), path: '/government-schemes', icon: Landmark },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-charcoal-border shadow-2xs">
      {/* Top Banner Utility Bar */}
      <div className="bg-forest-800 text-white text-xs px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">
              🇮🇳 Anganwadi Digital Health &amp; Nutrition System • POSHAN Abhiyaan 2.0
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-forest-900/80 px-2.5 py-0.5 rounded-lg border border-forest-700">
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <select
                aria-label="Language Selector"
                value={language}
                onChange={handleLanguageChange}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="en" className="text-slate-800">English</option>
                <option value="hi" className="text-slate-800">हिन्दी (Hindi)</option>
                <option value="kn" className="text-slate-800">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-charcoal-primary">
                  {t('brandName')}
                </span>
                <span className="bg-emerald-100 text-forest-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  HEALTH-TECH
                </span>
              </div>
              <p className="text-[11px] text-charcoal-secondary font-medium">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-mint-100 text-forest-800 font-bold'
                      : 'text-charcoal-secondary hover:text-forest-800 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {user && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive('/dashboard')
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-forest-800 bg-forest-50 hover:bg-forest-100/80'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* User Profile Menu / Auth CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition shadow-2xs"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-black text-xs">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-bold text-charcoal-primary leading-tight">
                      {user.displayName || user.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-charcoal-secondary uppercase tracking-wider font-semibold">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-charcoal-border shadow-xl p-2 space-y-1 z-50">
                    <div className="p-3 border-b border-slate-100 space-y-1">
                      <p className="text-xs font-bold text-charcoal-primary truncate">
                        {user.displayName}
                      </p>
                      <p className="text-[11px] text-charcoal-secondary truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        {user.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Email
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                            <AlertCircle className="w-3 h-3 text-amber-600" /> Pending Verification
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-forest-50 text-forest-800">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <TrendingUp className="w-4 h-4 text-forest-800" />
                      Worker Dashboard
                    </Link>

                    <Link
                      to="/growth-monitoring"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <TrendingUp className="w-4 h-4 text-forest-800" />
                      Child Growth Records
                    </Link>

                    <Link
                      to="/follow-ups"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <FileBarChart2 className="w-4 h-4 text-forest-800" />
                      Welfare Follow-Ups
                    </Link>

                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logout();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-primary hover:text-forest-800 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-forest-800 hover:bg-forest-900 shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-xl text-xs font-bold ${
                isActive(link.path)
                  ? 'bg-mint-100 text-forest-800'
                  : 'text-charcoal-primary hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="px-3 py-1 text-xs">
                <p className="font-bold text-charcoal-primary">{user.displayName}</p>
                <p className="text-[11px] text-charcoal-secondary">{user.email}</p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-white bg-forest-800 text-center"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={async () => {
                  setIsOpen(false);
                  await logout();
                }}
                className="w-full py-2 text-center text-xs font-bold text-rose-700 bg-rose-50 rounded-xl"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="py-2.5 rounded-xl border border-slate-300 text-center text-xs font-bold text-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="py-2.5 rounded-xl bg-forest-800 text-center text-xs font-bold text-white shadow"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
