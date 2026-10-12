import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{t('disclaimerText')}</span>
        </div>
        <span className="hidden md:inline bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded text-[11px] font-semibold shrink-0">
          WHO Standards 2006 Screening
        </span>
      </div>
    </div>
  );
};

