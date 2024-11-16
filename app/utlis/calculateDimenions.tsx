import { convertToFractionalInches } from './convertToFractionalInches';

interface Parts {
  [key: string]: {
    vertices: ArrayLike<number>;
  };
}

interface DimensionData {
  Part: string;
  'Length (cm)': number;
  'Width (cm)': number;
  'Thick (cm)': number;
  'Length (in)': number;
  'Width (in)': number;
  'Thick (in)': number;
  'Length (fractional in)': string;
  'Width (fractional in)': string;
  'Thick (fractional in)': string;
}

export const calculateDimensions = (parts: Parts): DimensionData[] => {
    const dimensions: DimensionData[] = [];
  
    for (const [partName, partData] of Object.entries(parts)) {
      const vertices = partData.vertices;
  
      // Separate x, y, z coordinates
      const xCoords = Array.from(vertices).filter((_, i) => i % 3 === 0);
      const yCoords = Array.from(vertices).filter((_, i) => i % 3 === 1);
      const zCoords = Array.from(vertices).filter((_, i) => i % 3 === 2);
  
      // Calculate dimensions in meters
      const dimensionsM = [
        Math.max(...xCoords) - Math.min(...xCoords), // Length
        Math.max(...yCoords) - Math.min(...yCoords), // Width
        Math.max(...zCoords) - Math.min(...zCoords), // Thickness
      ];
  
      // Convert dimensions
      const dimensionsCm = dimensionsM.map((d) => Math.round(d * 1000) / 10);

      // Sort dimensionsCm so the largest value is first (Length), middle is Width, and smallest is Thickness
      const sortedCm = [...dimensionsCm].sort((a, b) => b - a);

      const dimensionsInches = sortedCm.map((d) => parseFloat((d * 0.393701).toFixed(4)));
      const dimensionsFractional = sortedCm.map((d) => convertToFractionalInches(d));
  
      // Add part dimensions to the result
      dimensions.push({
        Part: partName,
        'Length (cm)': sortedCm[0],
        'Width (cm)': sortedCm[1],
        'Thick (cm)': sortedCm[2],
        'Length (in)': dimensionsInches[0],
        'Width (in)': dimensionsInches[1],
        'Thick (in)': dimensionsInches[2],
        'Length (fractional in)': dimensionsFractional[0],
        'Width (fractional in)': dimensionsFractional[1],
        'Thick (fractional in)': dimensionsFractional[2],
      });
    }
  
    return dimensions;
  };
