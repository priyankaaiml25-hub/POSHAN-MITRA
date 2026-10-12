import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { speakText, stopSpeech, isSpeechSupported } from '../utils/speech';
import {
  Sprout,
  ShieldCheck,
  Heart,
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  Calculator,
  Gamepad2,
  BookOpen,
  TrendingUp,
  Apple,
  CheckCircle2,
  Users,
  Lock,
  ChevronRight,
  Activity,
  Layers,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [isSpeakingTip, setIsSpeakingTip] = useState(false);

  const toggleSpeakTip = () => {
    if (isSpeakingTip) {
      stopSpeech();
      setIsSpeakingTip(false);
    } else {
      setIsSpeakingTip(true);
      const textToRead = `${t('dailyTipTitle')}. ${t('dailyTipContent')}`;
      speakText(textToRead, language, () => setIsSpeakingTip(false));
    }
  };

  const features = [
    {
      title: 'Nutrition Education',
      desc: '10 evidence-based modules covering energy-giving millets, protein pairing, micronutrient absorption, and 6-step hygiene with audio narration.',
      path: '/education',
      icon: BookOpen,
      tag: 'Multilingual TTS',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'Smart Budget Meal Planner',
      desc: 'Deterministic optimizer that creates balanced daily meal plans and itemized shopping lists calibrated to local market budgets (₹30 - ₹500).',
      path: '/meal-planner',
      icon: Calculator,
      tag: 'Rule-Based Engine',
      color: 'bg-forest-50 text-forest-800 border-forest-200',
    },
    {
      title: 'Poshan Play Learning Games',
      desc: 'Joyful picture quizzes, food sorting, rainbow plate builder, and handwashing sequence for children aged 3–6 with audio cheers and star rewards.',
      path: '/poshan-play',
      icon: Gamepad2,
      tag: 'Ages 3–6',
      color: 'bg-saffron-50 text-saffron-800 border-saffron-200',
    },
    {
      title: 'Validated Growth Tracking',
      desc: 'WHO 2006 Child Growth Standards implementation computing exact WAZ, HAZ, and WHZ Z-scores to alert workers when supportive review is needed.',
      path: '/growth-monitoring',
      icon: TrendingUp,
      tag: 'WHO 2006 Standards',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Screen & Assess',
      desc: 'Log calibrated weight and height under pseudonymous reference IDs. The WHO 2006 engine computes growth percentiles without manual errors.',
    },
    {
      num: '02',
      title: 'Plan Affordable Diets',
      desc: 'Generate balanced regional recipes utilizing local superfoods—Ragi, drumstick leaves, moong dal, eggs, and curd—within real household budgets.',
    },
    {
      num: '03',
      title: 'Educate & Follow Up',
      desc: 'Engage preschool children with interactive Poshan Play games while Anganwadi workers resolve home visits and healthcare referrals.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-50/60 via-mint-50/30 to-white pt-12 pb-20 border-b border-charcoal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/80 border border-forest-200 text-forest-800 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                <span>Anganwadi Child Welfare &amp; Dietetics Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-charcoal-primary leading-[1.1]">
                Better Nutrition.{' '}
                <span className="text-forest-800 underline decoration-forest-400 decoration-wavy decoration-2 underline-offset-8">
                  Brighter Futures.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal-secondary leading-relaxed max-w-2xl font-normal">
                Poshan Mitra equips frontline Anganwadi workers, caregivers, and rural families with practical, budget-conscious meal planning, validated WHO growth screening, and joyful preschool nutrition education.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={user ? '/dashboard' : '/register'}
                  className="px-6 py-3.5 rounded-2xl bg-forest-800 hover:bg-forest-900 active:scale-[0.99] text-white font-bold text-xs tracking-wider shadow-md hover:shadow-lg transition flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/education"
                  className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs tracking-wider shadow-2xs transition flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-forest-800" />
                  <span>Explore Nutrition</span>
                </Link>
                <Link
                  to="/meal-planner"
                  className="px-5 py-3.5 rounded-2xl bg-saffron-50 hover:bg-saffron-100/80 text-saffron-800 border border-saffron-200 font-bold text-xs transition flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-saffron-600" />
                  <span>Plan Budget Meal (₹)</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-charcoal-secondary font-medium border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-forest-800" />
                  <span>WHO 2006 Standards</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-forest-800" />
                  <span>Indigenous Indian Millets</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-forest-800" />
                  <span>Pseudonymous Child Privacy</span>
                </div>
              </div>
            </div>

            {/* Right Graphic & Daily Tip (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl border border-charcoal-border p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center font-bold">
                      <Sprout className="w-5 h-5 text-forest-800" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-primary">
                        {t('dailyTipTitle')}
                      </h3>
                      <p className="text-[10px] text-charcoal-secondary">ICMR-NIN Verified</p>
                    </div>
                  </div>

                  {isSpeechSupported() && (
                    <button
                      onClick={toggleSpeakTip}
                      aria-label="Read tip aloud"
                      className={`p-2 rounded-xl transition ${
                        isSpeakingTip
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-forest-50 text-forest-800 hover:bg-forest-100'
                      }`}
                      title={isSpeakingTip ? t('stopAudio') : t('listenAudio')}
                    >
                      {isSpeakingTip ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-200/60 text-xs text-charcoal-primary leading-relaxed space-y-2">
                  <p className="font-semibold text-forest-900">💡 Practical Kitchen Guidance:</p>
                  <p>{t('dailyTipContent')}</p>
                </div>

                {/* Affordable Indian Food Chips */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-charcoal-secondary">
                    Local High-Nutrient Staples
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-800">🌾 Ragi (Finger Millet)</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">344mg Calcium / 100g</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-800">🌿 Moringa Leaves</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">28mg Iron / 100g</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-800">🥣 Moong Dal</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Easy toddler digestion</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-800">🥚 Whole Boiled Egg</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Complete amino acids</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">25+ Indigenous Foods</span>
                  <Link to="/food-guide" className="font-bold text-forest-800 hover:underline flex items-center gap-1">
                    Open Food Library <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-forest-800 bg-mint-100 px-3 py-1 rounded-full">
            Core Platform Capabilities
          </span>
          <h2 className="text-3xl font-black text-charcoal-primary tracking-tight">
            Integrated Solutions for Grassroots Child Health
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-secondary">
            Bridging clinical pediatric standards with practical Indian community realities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.title}
                to={feat.path}
                className="group bg-white rounded-3xl border border-charcoal-border p-6 shadow-2xs hover:shadow-md hover:border-forest-400 transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.color} shadow-2xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {feat.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-charcoal-primary group-hover:text-forest-800 transition">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-charcoal-secondary leading-relaxed mt-1.5">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-forest-800 group-hover:translate-x-1 transition">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-forest-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Structured Methodology
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white">
              How Poshan Mitra Works
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80">
              A streamlined 3-step cycle designed for field Anganwadi centres and caregiver households.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st) => (
              <div
                key={st.num}
                className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 p-8 space-y-4 relative"
              >
                <span className="text-3xl font-black text-emerald-400 block font-mono">
                  {st.num}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {st.title}
                </h3>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Workers and Caregivers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Workers */}
          <div className="bg-white rounded-3xl border border-charcoal-border p-8 shadow-sm space-y-5">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-forest-800" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-charcoal-primary">
                For Anganwadi Field Workers
              </h3>
              <p className="text-xs text-charcoal-secondary mt-1">
                Save hours on manual calculations and focus on supportive home counselling.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Automated Z-score computation eliminates manual lookup tables</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Visual review alerts when WAZ or WHZ drops below -2 SD</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Structured task lists for scheduling ANM / ASHA healthcare visits</span>
              </li>
            </ul>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:underline pt-2"
            >
              Access Worker Dashboard →
            </Link>
          </div>

          {/* For Parents */}
          <div className="bg-white rounded-3xl border border-charcoal-border p-8 shadow-sm space-y-5">
            <div className="w-10 h-10 rounded-2xl bg-saffron-100 text-saffron-800 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5 text-saffron-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-charcoal-primary">
                For Parents &amp; Caregivers
              </h3>
              <p className="text-xs text-charcoal-secondary mt-1">
                Nourish growing toddlers without exceeding your daily family food budget.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
                <span>Balanced meal suggestions within real daily budgets (₹30 to ₹500)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
                <span>Audio narration in English, Hindi, and Kannada for low-literacy contexts</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
                <span>Preschool gamification that makes eating vegetables and washing hands fun</span>
              </li>
            </ul>
            <Link
              to="/meal-planner"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-800 hover:underline pt-2"
            >
              Start Meal Planning →
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy & Child Safety Framework */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-mint-50/70 border border-forest-200/80 rounded-3xl p-8 sm:p-10 space-y-4">
          <div className="flex items-center gap-2 text-forest-800 font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4 text-forest-800" />
            <span>Digital Child Welfare Privacy Framework</span>
          </div>
          <h2 className="text-2xl font-black text-charcoal-primary tracking-tight">
            Safety, Consent, and Responsible Health Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs text-charcoal-secondary leading-relaxed">
            <div className="bg-white p-4 rounded-2xl border border-forest-100 space-y-1">
              <h4 className="font-bold text-charcoal-primary">Pseudonymous Records</h4>
              <p>Children are recorded exclusively through anonymous reference codes (e.g. CH-BLR-001). No biometric or photographic identifiers are collected.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-forest-100 space-y-1">
              <h4 className="font-bold text-charcoal-primary">Screening, Not Diagnosis</h4>
              <p>Calculations adhere strictly to WHO 2006 reference standards for screening prioritization. The platform never issues autonomous medical diagnoses.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-forest-100 space-y-1">
              <h4 className="font-bold text-charcoal-primary">Zero Commercialization</h4>
              <p>No advertisements, tracking cookies, or monetization of family health data. Engineered purely for educational and public health utility.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
