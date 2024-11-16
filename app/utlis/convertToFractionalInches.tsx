export const convertToFractionalInches = (decimal:number) => {
    // Convert to inches with good precision
    decimal = parseFloat((decimal * 0.393701).toFixed(6));
  
    // Check if it's very close to a whole number and round up if needed
    if (Math.abs(decimal - Math.round(decimal)) < 1e-6) {
      return Math.round(decimal).toString();  // If it's very close to an integer, return the rounded value
    }
  
    // Separate the whole and fractional parts
    const whole = Math.floor(decimal);
    const decimalPart = decimal - whole;
  
    // Check if the decimal part is close enough to 1 to round up
    if (decimalPart >= 0.99) {
      return (whole + 1).toString();  // If the fractional part is very close to 1, round up
    }
  
    // Try fractions with different denominators (up to 64ths)
    let bestNumerator = 0;
    let bestDenominator = 1;
    let bestError = decimalPart;
  
    // Check denominators 1 through 64 (this could be increased for finer fractions)
    for (const denominator of [2, 4, 8, 16, 32, 64]) {
      const numerator = Math.round(decimalPart * denominator);
      const error = Math.abs(decimalPart - numerator / denominator);
  
      if (error < bestError) {
        bestNumerator = numerator;
        bestDenominator = denominator;
        bestError = error;
      }
    }
  
    // Simplify the fraction by finding the greatest common divisor (GCD)
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(bestNumerator, bestDenominator);
  
    bestNumerator /= divisor;
    bestDenominator /= divisor;
  
    // Special rounding case for fractions that are close to common simplified fractions
    if (bestDenominator === 64 && bestNumerator >= 31 && bestNumerator <= 33) {
        // Close to 1/2, so we round it to 1/2
        return `${whole} 1/2`;
    }
  
    // Return the fraction as a whole number with the best fraction found
    const fraction = bestNumerator === 0 ? '' : `${bestNumerator}/${bestDenominator}`;
    return whole === 0 ? fraction : `${whole} ${fraction}`;
  };
  