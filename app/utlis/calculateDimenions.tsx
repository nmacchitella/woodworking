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

    // Use Float64Array for maximum precision when working with coordinates
    const xCoords = Float64Array.from(vertices).filter((_, i) => i % 3 === 0);
    const yCoords = Float64Array.from(vertices).filter((_, i) => i % 3 === 1);
    const zCoords = Float64Array.from(vertices).filter((_, i) => i % 3 === 2);

    // Calculate dimensions in meters with full floating point precision
    const dimensionsM = [
      Number((Math.max(...xCoords) - Math.min(...xCoords)).toPrecision(15)),
      Number((Math.max(...yCoords) - Math.min(...yCoords)).toPrecision(15)),
      Number((Math.max(...zCoords) - Math.min(...zCoords)).toPrecision(15))
    ];

    // Convert to centimeters with high precision
    // Using multiplier as a constant to avoid floating point errors
    const CM_PER_METER = 100;
    const dimensionsCm = dimensionsM.map(d => 
      Number((d * CM_PER_METER).toPrecision(15))
    );

    // Sort dimensions maintaining full precision
    const sortedCm = [...dimensionsCm].sort((a, b) => b - a);

    // Convert to inches with maximum precision
    // Using exact conversion factor
    const INCHES_PER_CM = 0.393700787401575;
    const dimensionsInches = sortedCm.map(d => 
      Number((d * INCHES_PER_CM).toPrecision(15))
    );

    dimensions.push({
      Part: partName,
      'Length (cm)': Number(sortedCm[0].toFixed(4)),
      'Width (cm)': Number(sortedCm[1].toFixed(4)),
      'Thick (cm)': Number(sortedCm[2].toFixed(4)),
      'Length (in)': Number(dimensionsInches[0].toFixed(4)),
      'Width (in)': Number(dimensionsInches[1].toFixed(4)),
      'Thick (in)': Number(dimensionsInches[2].toFixed(4)),
      'Length (fractional in)': convertToFractionalInches(sortedCm[0]),
      'Width (fractional in)': convertToFractionalInches(sortedCm[1]),
      'Thick (fractional in)': convertToFractionalInches(sortedCm[2])
    });
  }

  return dimensions;
};