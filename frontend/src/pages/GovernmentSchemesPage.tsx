import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Landmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Users,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export const GovernmentSchemesPage: React.FC = () => {
  const { t } = useLanguage();

  const schemes = [
    {
      title: 'Saksham Anganwadi and POSHAN 2.0',
      ministry: 'Ministry of Women and Child Development (MWCD), Govt of India',
      purpose: 'An integrated nutrition support programme addressing the challenges of malnutrition in children, adolescent girls, pregnant women, and lactating mothers.',
      beneficiaries: 'Children 0–6 years, Pregnant Women & Lactating Mothers',
      keyBenefits: [
        'Supplementary Nutrition Programme (SNP) hot cooked meals & take-home rations (THR)',
        'Early childhood care and preschool education',
        'Growth monitoring and tracking through Poshan Tracker App',
      ],
      officialLink: 'https://poshanabhiyaan.gov.in',
      lastReviewed: 'September 2026',
      status: 'VERIFIED_OFFICIAL',
    },
    {
      title: 'Integrated Child Development Services (ICDS)',
      ministry: 'Ministry of Women and Child Development, Govt of India',
      purpose: 'Pioneering flagship scheme providing package of 6 essential services: supplementary nutrition, immunization, health check-up, referral services, pre-school non-formal education, and nutrition health education.',
      beneficiaries: 'Children under 6 years, Expectant and Nursing Mothers',
      keyBenefits: [
        'Free health checkups and referral to PHC/CHC hospitals',
        'Immunization coordination with ANM and ASHA workers',
        'Community Anganwadi Centre preschool learning activities',
      ],
      officialLink: 'https://wcd.nic.in/schemes/icds',
      lastReviewed: 'August 2026',
      status: 'VERIFIED_OFFICIAL',
    },
    {
      title: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
      ministry: 'Government of India Centrally Sponsored Scheme',
      purpose: 'Direct Benefit Transfer (DBT) maternity benefit scheme compensating wage loss and promoting adequate maternal nutrition during pregnancy and lactation.',
      beneficiaries: 'Pregnant women and lactating mothers for the first and second child (if girl child)',
      keyBenefits: [
        'Direct cash incentive deposited into Aadhaar-linked bank accounts',
        'Encourages early registration at Anganwadi and institutional deliveries',
        'Health and nutrition counselling at village health sanitation days',
      ],
      officialLink: 'https://pmmvy.wcd.gov.in',
      lastReviewed: 'July 2026',
      status: 'VERIFIED_OFFICIAL',
    },
    {
      title: 'PM POSHAN (Pradhan Mantri Poshan Shakti Nirman)',
      ministry: 'Ministry of Education, Govt of India',
      purpose: 'National school lunch programme providing wholesome hot cooked meals with specified minimum calorie and protein standards in government schools.',
      beneficiaries: 'Children enrolled in Balvatika and Primary/Upper Primary Classes (Grades 1 to 8)',
      keyBenefits: [
        'Daily balanced hot lunch with pulses, vegetables, and millets',
        'School nutrition gardens (Poshan Vatikas) for fresh greens',
        'Promotes school retention and social equity',
      ],
      officialLink: 'https://pmposhan.education.gov.in',
      lastReviewed: 'August 2026',
      status: 'VERIFIED_OFFICIAL',
    },
    {
      title: 'Anemia Mukt Bharat (AMB) Strategy',
      ministry: 'Ministry of Health and Family Welfare (MoHFW) & UNICEF',
      purpose: 'Comprehensive 6x6x6 strategy targeting iron-deficiency anaemia across life stages through bi-weekly IFA supplementation, deworming, and diet diversity.',
      beneficiaries: 'Children 6–59 months, Children 5–9 years, Adolescents & Women',
      keyBenefits: [
        'Weekly Iron and Folic Acid (IFA) syrup with calibrated dispenser for young children',
        'Bi-annual National Deworming Day (NDD) albendazole tablets',
        'Fortified foods with double fortified salt and testing of anaemia in village camps',
      ],
      officialLink: 'https://anemiamuktibharat.info',
      lastReviewed: 'September 2026',
      status: 'VERIFIED_OFFICIAL',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
            <Landmark className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('navGovtSchemes')} — Official Indian Welfare Programmes
          </h1>
        </div>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Verified directory of Government of India maternal, child welfare, and school nutrition schemes. Official links and application channels.
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((scheme, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-4 hover:border-poshan-400 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official Verified
                </span>
                <span className="text-slate-400 font-medium">Reviewed: {scheme.lastReviewed}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {scheme.title}
              </h2>
              <p className="text-xs text-poshan-700 font-semibold">
                {scheme.ministry}
              </p>

              <p className="text-xs text-slate-600 leading-relaxed">
                {scheme.purpose}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-500" /> Target Beneficiaries:
                </span>
                <p className="text-slate-800 font-medium">{scheme.beneficiaries}</p>
              </div>

              <div className="space-y-1.5 pt-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Key Scheme Provisions:
                </h4>
                {scheme.keyBenefits.map((b, bIdx) => (
                  <div key={bIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Confirm local district criteria
              </span>
              <a
                href={scheme.officialLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-poshan-700 hover:text-poshan-900 hover:underline"
              >
                Official Portal Link <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Verification Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Important Community Enrolment Note:</p>
          <p className="mt-0.5 leading-relaxed">
            All schemes listed above are implemented through local state department administrative channels. Families seeking enrolment should carry Aadhaar card and bank passbook to their assigned Anganwadi Centre or Child Development Project Officer (CDPO) in their taluk/district.
          </p>
        </div>
      </div>
    </div>
  );
};

