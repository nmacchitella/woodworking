
export const convertToFractionalInches = (centimeters: number): string => {
  // Use exact conversion factor
  const INCHES_PER_CM = 0.393700787401575;
  const decimal = Number((centimeters * INCHES_PER_CM).toPrecision(15));

  // Improved rounding threshold
  const ROUNDING_THRESHOLD = 1e-10;
  
  // Check if very close to whole number
  if (Math.abs(decimal - Math.round(decimal)) < ROUNDING_THRESHOLD) {
    return Math.round(decimal).toString();
  }

  const whole = Math.floor(decimal);
  const decimalPart = Number((decimal - whole).toPrecision(15));

  // Check if very close to next whole number
  if (1 - decimalPart < ROUNDING_THRESHOLD) {
    return (whole + 1).toString();
  }

  // Array of standard denominators
  const DENOMINATORS = [2, 4, 8, 16, 32, 64];
  
  let bestNumerator = 0;
  let bestDenominator = 1;
  let bestError = decimalPart;

  // Find best fraction approximation
  for (const denominator of DENOMINATORS) {
    const numerator = Math.round(decimalPart * denominator);
    const error = Math.abs(decimalPart - numerator / denominator);

    if (error < bestError) {
      bestNumerator = numerator;
      bestDenominator = denominator;
      bestError = error;
    }
  }

  // Simplify fraction
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(bestNumerator, bestDenominator);

  bestNumerator = Math.round(bestNumerator / divisor);
  bestDenominator = Math.round(bestDenominator / divisor);

  // Special case handling for common fractions
  if (bestDenominator === 64) {
    // Map close to standard fractions
    if (bestNumerator >= 31 && bestNumerator <= 33) return `${whole} 1/2`;
    if (bestNumerator >= 15 && bestNumerator <= 17) return `${whole} 1/4`;
    if (bestNumerator >= 47 && bestNumerator <= 49) return `${whole} 3/4`;
  }

  const fraction = bestNumerator === 0 ? '' : `${bestNumerator}/${bestDenominator}`;
  return whole === 0 ? fraction : `${whole} ${fraction}`;
};