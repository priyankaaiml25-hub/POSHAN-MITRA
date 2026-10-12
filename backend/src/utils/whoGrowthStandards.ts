/**
 * WHO Child Growth Standards (2006) Calculation & Interpretation Engine
 * 
 * Implements age- and sex-stratified calculations based on WHO Child Growth Standards:
 * - Weight-for-Age (WAZ) for 0-60 months
 * - Height/Length-for-Age (HAZ) for 0-60 months
 * - Weight-for-Height (WHZ) for heights 45 cm - 115 cm
 * 
 * DISCLAIMER:
 * This module provides educational screening metrics for Anganwadi workers to prioritize
 * supportive follow-ups and referrals. It is NOT a clinical diagnosis or treatment prescription.
 */

export type Gender = 'MALE' | 'FEMALE';

export interface GrowthMetricsInput {
  dateOfBirth: Date;
  measurementDate: Date;
  gender: Gender;
  weightKg: number;
  heightCm: number;
}

export interface GrowthInterpretation {
  ageMonths: number;
  waz: number;
  haz: number;
  whz: number;
  statusWaz: 'NORMAL' | 'MODERATE_UNDERWEIGHT' | 'SEVERE_UNDERWEIGHT' | 'OVERWEIGHT';
  statusHaz: 'NORMAL' | 'MODERATE_STUNTING' | 'SEVERE_STUNTING' | 'TALL';
  statusWhz: 'NORMAL' | 'MODERATE_WASTING' | 'SEVERE_WASTING' | 'OVERWEIGHT';
  needsReview: boolean;
  reviewReason?: string;
  disclaimer: string;
}

// WHO 2006 Reference Data (Median and 1 Standard Deviation)
// Boys Weight-for-Age (kg) by Month (0 to 60)
const BOYS_WEIGHT_REF: Record<number, { median: number; sd: number }> = {
  0: { median: 3.3, sd: 0.5 },
  3: { median: 6.4, sd: 0.8 },
  6: { median: 7.9, sd: 0.9 },
  9: { median: 8.9, sd: 1.0 },
  12: { median: 9.6, sd: 1.1 },
  18: { median: 10.9, sd: 1.2 },
  24: { median: 12.2, sd: 1.4 },
  30: { median: 13.3, sd: 1.5 },
  36: { median: 14.3, sd: 1.7 },
  42: { median: 15.3, sd: 1.8 },
  48: { median: 16.3, sd: 2.0 },
  54: { median: 17.3, sd: 2.2 },
  60: { median: 18.3, sd: 2.4 },
};

// Girls Weight-for-Age (kg) by Month (0 to 60)
const GIRLS_WEIGHT_REF: Record<number, { median: number; sd: number }> = {
  0: { median: 3.2, sd: 0.5 },
  3: { median: 5.8, sd: 0.7 },
  6: { median: 7.3, sd: 0.9 },
  9: { median: 8.2, sd: 1.0 },
  12: { median: 8.9, sd: 1.1 },
  18: { median: 10.2, sd: 1.2 },
  24: { median: 11.5, sd: 1.4 },
  30: { median: 12.7, sd: 1.6 },
  36: { median: 13.9, sd: 1.8 },
  42: { median: 15.0, sd: 2.0 },
  48: { median: 16.1, sd: 2.1 },
  54: { median: 17.2, sd: 2.3 },
  60: { median: 18.2, sd: 2.5 },
};

// Boys Height-for-Age (cm) by Month (0 to 60)
const BOYS_HEIGHT_REF: Record<number, { median: number; sd: number }> = {
  0: { median: 49.9, sd: 1.9 },
  3: { median: 61.4, sd: 2.2 },
  6: { median: 67.6, sd: 2.4 },
  9: { median: 72.0, sd: 2.5 },
  12: { median: 75.7, sd: 2.6 },
  18: { median: 82.3, sd: 2.9 },
  24: { median: 87.8, sd: 3.2 },
  30: { median: 92.4, sd: 3.5 },
  36: { median: 96.1, sd: 3.7 },
  42: { median: 99.9, sd: 4.0 },
  48: { median: 103.3, sd: 4.2 },
  54: { median: 106.7, sd: 4.4 },
  60: { median: 110.0, sd: 4.7 },
};

// Girls Height-for-Age (cm) by Month (0 to 60)
const GIRLS_HEIGHT_REF: Record<number, { median: number; sd: number }> = {
  0: { median: 49.1, sd: 1.9 },
  3: { median: 59.8, sd: 2.1 },
  6: { median: 65.7, sd: 2.3 },
  9: { median: 70.1, sd: 2.4 },
  12: { median: 74.0, sd: 2.6 },
  18: { median: 80.7, sd: 2.9 },
  24: { median: 86.4, sd: 3.3 },
  30: { median: 91.2, sd: 3.6 },
  36: { median: 95.1, sd: 3.8 },
  42: { median: 99.0, sd: 4.1 },
  48: { median: 102.7, sd: 4.3 },
  54: { median: 106.2, sd: 4.5 },
  60: { median: 109.4, sd: 4.7 },
};

// Weight-for-Height/Length (kg) Reference Samples (cm: 50 to 110)
const WEIGHT_FOR_HEIGHT_REF: Record<number, { median: number; sd: number }> = {
  50: { median: 3.3, sd: 0.4 },
  55: { median: 4.4, sd: 0.5 },
  60: { median: 5.7, sd: 0.6 },
  65: { median: 7.2, sd: 0.7 },
  70: { median: 8.5, sd: 0.8 },
  75: { median: 9.6, sd: 0.9 },
  80: { median: 10.6, sd: 1.0 },
  85: { median: 11.8, sd: 1.1 },
  90: { median: 13.0, sd: 1.2 },
  95: { median: 14.3, sd: 1.4 },
  100: { median: 15.6, sd: 1.5 },
  105: { median: 17.0, sd: 1.7 },
  110: { median: 18.5, sd: 1.9 },
};

/**
 * Linear interpolation helper for age or height reference points
 */
function interpolateRef(
  key: number,
  table: Record<number, { median: number; sd: number }>
): { median: number; sd: number } {
  const keys = Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b);
  
  if (key <= keys[0]) return table[keys[0]];
  if (key >= keys[keys.length - 1]) return table[keys[keys.length - 1]];

  for (let i = 0; i < keys.length - 1; i++) {
    const k1 = keys[i];
    const k2 = keys[i + 1];
    if (key >= k1 && key <= k2) {
      const ratio = (key - k1) / (k2 - k1);
      const median = table[k1].median + ratio * (table[k2].median - table[k1].median);
      const sd = table[k1].sd + ratio * (table[k2].sd - table[k1].sd);
      return { median, sd };
    }
  }

  return table[keys[0]];
}

/**
 * Calculates age in full and fractional months between two dates
 */
export function calculateAgeMonths(dob: Date, measurementDate: Date): number {
  const d1 = new Date(dob);
  const d2 = new Date(measurementDate);
  const diffTime = Math.max(0, d2.getTime() - d1.getTime());
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const ageMonths = diffDays / 30.4375; // average days in a month
  return Math.round(ageMonths * 10) / 10;
}

/**
 * Computes Z-scores and clinical screening classification according to WHO standards
 */
export function calculateGrowthStatus(input: GrowthMetricsInput): GrowthInterpretation {
  const ageMonths = calculateAgeMonths(input.dateOfBirth, input.measurementDate);

  // Validate plausible input ranges
  if (input.weightKg <= 0.5 || input.weightKg > 45) {
    throw new Error('Weight value out of physiologically plausible pediatric screening range (0.5 - 45 kg)');
  }
  if (input.heightCm < 35 || input.heightCm > 140) {
    throw new Error('Height value out of physiologically plausible pediatric screening range (35 - 140 cm)');
  }

  const weightTable = input.gender === 'MALE' ? BOYS_WEIGHT_REF : GIRLS_WEIGHT_REF;
  const heightTable = input.gender === 'MALE' ? BOYS_HEIGHT_REF : GIRLS_HEIGHT_REF;

  const weightRef = interpolateRef(ageMonths, weightTable);
  const heightRef = interpolateRef(ageMonths, heightTable);
  const whRef = interpolateRef(input.heightCm, WEIGHT_FOR_HEIGHT_REF);

  const waz = Number(((input.weightKg - weightRef.median) / weightRef.sd).toFixed(2));
  const haz = Number(((input.heightCm - heightRef.median) / heightRef.sd).toFixed(2));
  const whz = Number(((input.weightKg - whRef.median) / whRef.sd).toFixed(2));

  // Determine WAZ status
  let statusWaz: GrowthInterpretation['statusWaz'] = 'NORMAL';
  if (waz < -3.0) statusWaz = 'SEVERE_UNDERWEIGHT';
  else if (waz < -2.0) statusWaz = 'MODERATE_UNDERWEIGHT';
  else if (waz > 2.0) statusWaz = 'OVERWEIGHT';

  // Determine HAZ status
  let statusHaz: GrowthInterpretation['statusHaz'] = 'NORMAL';
  if (haz < -3.0) statusHaz = 'SEVERE_STUNTING';
  else if (haz < -2.0) statusHaz = 'MODERATE_STUNTING';
  else if (haz > 2.0) statusHaz = 'TALL';

  // Determine WHZ status
  let statusWhz: GrowthInterpretation['statusWhz'] = 'NORMAL';
  if (whz < -3.0) statusWhz = 'SEVERE_WASTING';
  else if (whz < -2.0) statusWhz = 'MODERATE_WASTING';
  else if (whz > 2.0) statusWhz = 'OVERWEIGHT';

  // Determine if worker review is flagged
  const reviewReasons: string[] = [];
  if (statusWhz === 'SEVERE_WASTING') {
    reviewReasons.push('Weight-for-Height below -3 SD (Severe Wasting pattern - requires priority ANM/MO referral)');
  } else if (statusWhz === 'MODERATE_WASTING') {
    reviewReasons.push('Weight-for-Height below -2 SD (Moderate Wasting - prioritize nutrition counselling & supplementary feeding)');
  }

  if (statusWaz === 'SEVERE_UNDERWEIGHT') {
    reviewReasons.push('Weight-for-Age below -3 SD (Severe Underweight)');
  } else if (statusWaz === 'MODERATE_UNDERWEIGHT') {
    reviewReasons.push('Weight-for-Age below -2 SD (Moderate Underweight)');
  }

  if (statusHaz === 'SEVERE_STUNTING') {
    reviewReasons.push('Height-for-Age below -3 SD (Severe Stunting - chronic growth deficit)');
  }

  const needsReview = reviewReasons.length > 0;
  const reviewReason = needsReview ? reviewReasons.join('; ') : undefined;

  return {
    ageMonths,
    waz,
    haz,
    whz,
    statusWaz,
    statusHaz,
    statusWhz,
    needsReview,
    reviewReason,
    disclaimer: 'Educational screening indicator based on WHO Child Growth Standards (2006). Not a medical diagnosis. Consult ANM/PHC Doctor for clinical confirmation and medical management.'
  };
}

