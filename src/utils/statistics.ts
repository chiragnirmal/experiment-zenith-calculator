
/**
 * Statistical functions for sample size calculations
 */

// Constants for z-scores
const Z_SCORES = {
  0.8: 0.84,
  0.85: 1.04,
  0.9: 1.28,
  0.95: 1.65,
  0.99: 2.33,
  0.995: 2.58,
  0.999: 3.29,
};

/**
 * Get Z score for a given confidence level
 */
export const getZScore = (confidenceLevel: number): number => {
  const key = confidenceLevel as keyof typeof Z_SCORES;
  return Z_SCORES[key] || 1.96; // Default to 95% confidence if not found
};

/**
 * Calculate sample size for binomial metrics (conversion rates)
 */
export const calculateBinomialSampleSize = (
  baselineConversion: number,
  minimumDetectableEffect: number,
  significance: number,
  power: number
): number => {
  const p1 = baselineConversion / 100;
  const p2 = p1 * (1 + minimumDetectableEffect / 100);
  const alpha = 1 - significance;
  const beta = 1 - power;
  
  const zalpha = getZScore(significance);
  const zbeta = getZScore(power);
  
  const sd1 = Math.sqrt(2 * p1 * (1 - p1));
  const sd2 = Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  
  const numerator = Math.pow(zalpha * sd1 + zbeta * sd2, 2);
  const denominator = Math.pow(p2 - p1, 2);
  
  return Math.ceil(numerator / denominator);
};

/**
 * Calculate sample size for continuous metrics
 */
export const calculateContinuousSampleSize = (
  mean: number,
  standardDeviation: number,
  minimumDetectableEffect: number,
  significance: number,
  power: number
): number => {
  const mde = minimumDetectableEffect / 100 * mean;
  const zalpha = getZScore(significance);
  const zbeta = getZScore(power);
  
  const numerator = 2 * Math.pow(standardDeviation, 2) * Math.pow(zalpha + zbeta, 2);
  const denominator = Math.pow(mde, 2);
  
  return Math.ceil(numerator / denominator);
};

/**
 * Calculate sample size for ratio metrics
 */
export const calculateRatioSampleSize = (
  mean: number,
  standardDeviation: number,
  minimumDetectableEffect: number,
  significance: number,
  power: number
): number => {
  // For ratio metrics, we use a similar approach to continuous metrics
  // but account for the relative nature of the change
  const mde = minimumDetectableEffect / 100 * mean;
  const cv = standardDeviation / mean; // Coefficient of variation
  
  const zalpha = getZScore(significance);
  const zbeta = getZScore(power);
  
  const numerator = 2 * Math.pow(cv, 2) * Math.pow(zalpha + zbeta, 2);
  const denominator = Math.pow(minimumDetectableEffect / 100, 2);
  
  return Math.ceil(numerator / denominator);
};
