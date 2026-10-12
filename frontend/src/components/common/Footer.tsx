import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { Sprout, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-poshan-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {t('brandName')}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              {t('subtagline')}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Aligned with POSHAN Abhiyaan 2.0</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Core Modules
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/education" className="hover:text-emerald-400 transition">
                  {t('navEducation')}
                </Link>
              </li>
              <li>
                <Link to="/food-guide" className="hover:text-emerald-400 transition">
                  {t('navFoodGuide')}
                </Link>
              </li>
              <li>
                <Link to="/meal-planner" className="hover:text-emerald-400 transition">
                  {t('navMealPlanner')}
                </Link>
              </li>
              <li>
                <Link to="/poshan-play" className="hover:text-emerald-400 transition">
                  {t('navPoshanPlay')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Anganwadi Workflows */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Anganwadi Centre
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition">
                  {t('navDashboard')}
                </Link>
              </li>
              <li>
                <Link to="/growth-monitoring" className="hover:text-emerald-400 transition">
                  {t('navGrowthMonitoring')}
                </Link>
              </li>
              <li>
                <Link to="/follow-ups" className="hover:text-emerald-400 transition">
                  {t('navFollowUps')}
                </Link>
              </li>
              <li>
                <Link to="/impact-reports" className="hover:text-emerald-400 transition">
                  {t('navImpactReports')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Portals & Verification */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Official Indian Portals
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="https://poshanabhiyaan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition"
                >
                  POSHAN Abhiyaan Portal
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://wcd.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition"
                >
                  Ministry of WCD, Govt of India
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.who.int/tools/child-growth-standards"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition"
                >
                  WHO Child Growth Standards (2006)
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Responsible Digital Health Disclaimer */}
        <div className="pt-6 mt-6 border-t border-slate-800 text-xs text-slate-500 space-y-2">
          <p>
            <strong className="text-slate-400">Educational & Digital Health Disclaimer:</strong> Poshan Mitra is an academic mini project and pilot demonstration designed to assist Anganwadi workers, caregivers, and community educators. It does not replace medical consultation, clinical diagnosis, or specialized therapeutic feeding prescriptions. All growth indicators are calculated based on WHO 2006 standards for screening prioritization.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-2 text-slate-400">
            <span>© 2026 Poshan Mitra. Built for Child Welfare & Community Nutrition.</span>
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Anganwadi Centres
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

