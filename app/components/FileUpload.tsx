'use client';

import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Object3D, Mesh } from 'three';
import { calculateDimensions } from '../utlis/calculateDimenions';
import Image from 'next/image';

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

interface FileUploadProps {
  onFilesProcessed: (data: CutListData[]) => void;
}

interface CutListData {
  fileName: string;
  data: DimensionData[];
}

interface Parts {
  [key: string]: {
    vertices: ArrayLike<number>;
  };
}

const FileUpload = ({ onFilesProcessed }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hasFiles, setHasFiles] = useState(false);
  const [currentData, setCurrentData] = useState<CutListData[]>([]);

  const processFiles = async (files: File[]) => {
    const newCutListData: CutListData[] = [];

    for (const file of files) {
      const contents = await readFileAsync(file);
      const loader = new OBJLoader();
      const object = loader.parse(contents);

      const parts: Parts = {};
      object.traverse((child: Object3D) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          const partName = mesh.name;
          parts[partName] = {
            vertices: mesh.geometry.attributes.position.array,
          };
        }
      });

      const dimensions = calculateDimensions(parts);
      newCutListData.push({
        fileName: file.name,
        data: dimensions,
      });
    }

    // Merge new data with existing data
    const updatedData = [...currentData, ...newCutListData];
    setCurrentData(updatedData);
    setHasFiles(true);
    onFilesProcessed(updatedData);
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await processFiles(Array.from(files));
    }
  };

  const readFileAsync = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = (event) => reject(event.target?.error || new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFiles(files);
    }
  }, [processFiles]);

  const handleStartOver = () => {
    setHasFiles(false);
    setCurrentData([]);
    onFilesProcessed([]);
  };

  if (!hasFiles) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className={`w-full max-w-xl p-8 text-center ${
            isDragging 
              ? 'border-4 border-blue-500 bg-blue-50' 
              : 'border-4 border-dashed border-gray-300'
          } rounded-lg transition-colors`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-4">
            <Image 
              src="/file.svg" 
              alt="Upload" 
              width={64}
              height={64}
              className="mx-auto mb-4 opacity-50"
            />
            <h3 className="text-xl font-semibold mb-2">
              Drop your .obj files here
            </h3>
            <p className="text-gray-500 mb-4">
              or click to select files
            </p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".obj"
            />
            <span className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Select Files
            </span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 mb-8 justify-end">
      <label className="cursor-pointer">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept=".obj"
        />
        <span className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors inline-flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add More Files
        </span>
      </label>
      <button
        onClick={handleStartOver}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors inline-flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        Start Over
      </button>
    </div>
  );
};

export default FileUpload;
