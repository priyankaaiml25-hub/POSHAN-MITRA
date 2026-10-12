import { describe, it, expect } from 'vitest';
import { calculateGrowthStatus, calculateAgeMonths } from '../src/utils/whoGrowthStandards.js';

describe('WHO Child Growth Standards Engine (2006)', () => {
  it('correctly calculates age in months', () => {
    const dob = new Date('2024-01-01');
    const measurementDate = new Date('2024-07-01');
    const ageMonths = calculateAgeMonths(dob, measurementDate);
    expect(ageMonths).toBeCloseTo(6.0, 0);
  });

  it('classifies normal weight child correctly', () => {
    // 24 months old boy, ~12.2 kg is median
    const dob = new Date('2024-10-01');
    const measurementDate = new Date('2026-10-01'); // 24 months
    const result = calculateGrowthStatus({
      dateOfBirth: dob,
      measurementDate,
      gender: 'MALE',
      weightKg: 12.2,
      heightCm: 87.8,
    });

    expect(result.statusWaz).toBe('NORMAL');
    expect(result.statusHaz).toBe('NORMAL');
    expect(result.statusWhz).toBe('NORMAL');
    expect(result.needsReview).toBe(false);
  });

  it('flags child with WAZ < -2 SD as Moderate Underweight needing review', () => {
    // 24 months old boy, ~9.0 kg is well below -2 SD (sd = 1.4, median = 12.2, so 12.2 - 2*1.4 = 9.4)
    const dob = new Date('2024-10-01');
    const measurementDate = new Date('2026-10-01'); // 24 months
    const result = calculateGrowthStatus({
      dateOfBirth: dob,
      measurementDate,
      gender: 'MALE',
      weightKg: 8.8,
      heightCm: 87.8,
    });

    expect(result.statusWaz).toBe('MODERATE_UNDERWEIGHT');
    expect(result.needsReview).toBe(true);
    expect(result.reviewReason).toContain('Moderate Underweight');
  });

  it('flags severe wasting when weight-for-height Z-score is below -3 SD', () => {
    const dob = new Date('2024-10-01');
    const measurementDate = new Date('2026-10-01');
    const result = calculateGrowthStatus({
      dateOfBirth: dob,
      measurementDate,
      gender: 'FEMALE',
      weightKg: 6.8, // severe wasting for 87cm
      heightCm: 87.0,
    });

    expect(result.needsReview).toBe(true);
    expect(result.statusWhz).toBe('SEVERE_WASTING');
    expect(result.reviewReason).toContain('Severe Wasting pattern');
  });

  it('rejects physiologically implausible weight inputs', () => {
    const dob = new Date('2024-10-01');
    const measurementDate = new Date('2026-10-01');
    expect(() => {
      calculateGrowthStatus({
        dateOfBirth: dob,
        measurementDate,
        gender: 'MALE',
        weightKg: 0.2, // impossible
        heightCm: 80,
      });
    }).toThrow();
  });
});

