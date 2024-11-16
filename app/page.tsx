'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import CutListTable from './components/CutListTable';

export default function Home() {
  const [cutLists, setCutLists] = useState([]);

  return (
    <div>
      <h1>Cut List Generator</h1>
      <FileUpload onFilesProcessed={setCutLists} />
      <CutListTable cutLists={cutLists} />
    </div>
  );
}
