import { describe, it, expect } from 'vitest';
import { translations } from '../i18n/translations';

describe('Poshan Mitra Multilingual Translation System', () => {
  it('contains English, Hindi, and Kannada translations for brand name and tagline', () => {
    expect(translations.brandName.en).toBe('Poshan Mitra');
    expect(translations.brandName.hi).toBe('पोषण मित्र');
    expect(translations.brandName.kn).toBe('ಪೋಷಣ್ ಮಿತ್ರ');

    expect(translations.tagline.en).toBe('Healthy Food, Happy Children');
    expect(translations.tagline.hi).toBe('स्वस्थ भोजन, खुशहाल बच्चे');
    expect(translations.tagline.kn).toBe('ಆರೋಗ್ಯಕರ ಆಹಾರ, ಸಂತೋಷದ ಮಕ್ಕಳು');
  });

  it('provides translations for all core navigation items', () => {
    const navKeys = [
      'navHome',
      'navDashboard',
      'navEducation',
      'navFoodGuide',
      'navMealPlanner',
      'navPoshanPlay',
      'navGrowthMonitoring',
      'navFollowUps',
      'navImpactReports',
    ];

    navKeys.forEach((key) => {
      expect(translations[key]).toBeDefined();
      expect(translations[key].en.length).toBeGreaterThan(0);
      expect(translations[key].hi.length).toBeGreaterThan(0);
      expect(translations[key].kn.length).toBeGreaterThan(0);
    });
  });

  it('includes standard educational and screening disclaimers', () => {
    expect(translations.disclaimerText.en).toContain('Educational & Anganwadi Support Platform');
    expect(translations.disclaimerText.hi).toContain('शैक्षणिक और आंगनवाड़ी सहायता मंच');
    expect(translations.disclaimerText.kn).toContain('ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಅಂಗನವಾಡಿ ಬೆಂಬಲ ವೇದಿಕೆ');
  });
});

