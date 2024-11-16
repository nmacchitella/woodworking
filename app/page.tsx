'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import CutListTable from './components/CutListTable';

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

interface CutListData {
  fileName: string;
  data: DimensionData[];
}

export default function Home() {
  const [cutLists, setCutLists] = useState<CutListData[]>([]);

  return (
    <div>
      <h1>Cut List Generator</h1>
      <FileUpload onFilesProcessed={setCutLists} />
      <CutListTable cutLists={cutLists} />
    </div>
  );
}
