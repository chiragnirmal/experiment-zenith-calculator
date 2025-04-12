
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

// Constants for t-scores (for degrees of freedom = 30, which is common for initial estimates)
// These values will be refined during the iterative calculation
const T_SCORES = {
  0.8: 0.854,
  0.85: 1.055,
  0.9: 1.31,
  0.95: 1.697,
  0.99: 2.457,
  0.995: 2.75,
  0.999: 3.646,
};

/**
 * Get Z score for a given confidence level
 */
export const getZScore = (confidenceLevel: number): number => {
  const key = confidenceLevel as keyof typeof Z_SCORES;
  return Z_SCORES[key] || 1.96; // Default to 95% confidence if not found
};

/**
 * Get initial T score for a given confidence level
 * This is used as a starting point for the iterative calculation
 */
export const getInitialTScore = (confidenceLevel: number): number => {
  const key = confidenceLevel as keyof typeof T_SCORES;
  return T_SCORES[key] || 1.697; // Default to 95% confidence if not found
};

/**
 * Apply Bonferroni correction to the significance level based on number of comparisons
 * With multiple comparisons, we need to adjust the significance level to control the
 * familywise error rate.
 */
export const applyBonferroniCorrection = (significance: number, comparisons: number): number => {
  // If only one comparison (one variation vs control), no correction needed
  if (comparisons <= 1) return significance;
  
  // The corrected significance level
  const correctedAlpha = 1 - Math.pow(1 - (1 - significance), 1/comparisons);
  
  // We never want the significance to go below 0.5 as it makes calculations unstable
  return Math.max(correctedAlpha, 0.5);
};

/**
 * Calculate t-value for a given degrees of freedom and alpha
 * Uses an approximation formula that is accurate to within 0.05 units for df > 10
 */
export const calculateTValue = (degreesOfFreedom: number, confidenceLevel: number): number => {
  const alpha = 1 - confidenceLevel;
  const a = 1 - alpha / 2;
  
  // For very small df, return a conservative estimate
  if (degreesOfFreedom < 3) return getInitialTScore(confidenceLevel) * 1.5;
  
  // This is an approximation formula for t-distribution
  // Based on Abramowitz and Stegun approximation
  const w = Math.log(degreesOfFreedom);
  const u = Math.log(w);
  
  let t;
  if (a === 0.975) {
    // Approximation for 95% confidence (two-tailed)
    t = 1.96 + 0.958 / degreesOfFreedom + 0.25 / Math.pow(degreesOfFreedom, 2);
  } else if (a === 0.95) {
    // Approximation for 90% confidence (two-tailed)
    t = 1.645 + 0.727 / degreesOfFreedom + 0.18 / Math.pow(degreesOfFreedom, 2);
  } else if (a === 0.995) {
    // Approximation for 99% confidence (two-tailed)
    t = 2.576 + 1.28 / degreesOfFreedom + 0.38 / Math.pow(degreesOfFreedom, 2);
  } else {
    // General approximation for other confidence levels
    // This is less accurate but provides a reasonable estimate
    const z = getZScore(confidenceLevel);
    t = z + 0.85 / degreesOfFreedom + 0.22 / Math.pow(degreesOfFreedom, 2);
  }
  
  return t;
};

/**
 * Calculate sample size for binomial metrics (conversion rates) using t-distribution
 */
export const calculateBinomialSampleSize = (
  baselineConversion: number,
  minimumDetectableEffect: number,
  significance: number,
  power: number,
  variations: number = 1
): number => {
  const p1 = baselineConversion / 100;
  const p2 = p1 * (1 + minimumDetectableEffect / 100);
  
  // Apply Bonferroni correction for multiple comparisons
  const correctedSignificance = applyBonferroniCorrection(significance, variations);
  
  // Start with an initial estimate using z-scores
  let zalpha = getZScore(correctedSignificance);
  let zbeta = getZScore(power);
  
  const sd1 = Math.sqrt(2 * p1 * (1 - p1));
  const sd2 = Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  
  let numerator = Math.pow(zalpha * sd1 + zbeta * sd2, 2);
  let denominator = Math.pow(p2 - p1, 2);
  
  let sampleSize = Math.ceil(numerator / denominator);
  
  // Iterative approach to refine the estimate using t-distribution
  // Usually 3-4 iterations are enough to converge
  for (let i = 0; i < 4; i++) {
    // Degrees of freedom for two-sample test
    const df = 2 * sampleSize - 2;
    
    // Calculate t-values based on current df estimate
    const talpha = calculateTValue(df, correctedSignificance);
    const tbeta = calculateTValue(df, power);
    
    // Recalculate sample size with t-values
    numerator = Math.pow(talpha * sd1 + tbeta * sd2, 2);
    sampleSize = Math.ceil(numerator / denominator);
  }
  
  return sampleSize;
};

/**
 * Calculate sample size for continuous metrics using t-distribution
 */
export const calculateContinuousSampleSize = (
  mean: number,
  standardDeviation: number,
  minimumDetectableEffect: number,
  significance: number,
  power: number,
  variations: number = 1
): number => {
  const mde = minimumDetectableEffect / 100 * mean;
  
  // Apply Bonferroni correction for multiple comparisons
  const correctedSignificance = applyBonferroniCorrection(significance, variations);
  
  // Start with an initial estimate using z-scores
  let sampleSize = Math.ceil(
    2 * Math.pow(standardDeviation, 2) * Math.pow(getZScore(correctedSignificance) + getZScore(power), 2) / 
    Math.pow(mde, 2)
  );
  
  // Iterative approach to refine the estimate using t-distribution
  for (let i = 0; i < 4; i++) {
    // Degrees of freedom for two-sample test
    const df = 2 * sampleSize - 2;
    
    // Calculate t-values based on current df estimate
    const talpha = calculateTValue(df, correctedSignificance);
    const tbeta = calculateTValue(df, power);
    
    // Recalculate sample size with t-values
    sampleSize = Math.ceil(
      2 * Math.pow(standardDeviation, 2) * Math.pow(talpha + tbeta, 2) / 
      Math.pow(mde, 2)
    );
  }
  
  return sampleSize;
};

/**
 * Calculate sample size for ratio metrics using t-distribution
 */
export const calculateRatioSampleSize = (
  mean: number,
  standardDeviation: number,
  minimumDetectableEffect: number,
  significance: number,
  power: number,
  variations: number = 1
): number => {
  // For ratio metrics, we use a similar approach to continuous metrics
  // but account for the relative nature of the change
  const cv = standardDeviation / mean; // Coefficient of variation
  
  // Apply Bonferroni correction for multiple comparisons
  const correctedSignificance = applyBonferroniCorrection(significance, variations);
  
  // Start with an initial estimate using z-scores
  let sampleSize = Math.ceil(
    2 * Math.pow(cv, 2) * Math.pow(getZScore(correctedSignificance) + getZScore(power), 2) / 
    Math.pow(minimumDetectableEffect / 100, 2)
  );
  
  // Iterative approach to refine the estimate using t-distribution
  for (let i = 0; i < 4; i++) {
    // Degrees of freedom for two-sample test
    const df = 2 * sampleSize - 2;
    
    // Calculate t-values based on current df estimate
    const talpha = calculateTValue(df, correctedSignificance);
    const tbeta = calculateTValue(df, power);
    
    // Recalculate sample size with t-values
    sampleSize = Math.ceil(
      2 * Math.pow(cv, 2) * Math.pow(talpha + tbeta, 2) / 
      Math.pow(minimumDetectableEffect / 100, 2)
    );
  }
  
  return sampleSize;
};
