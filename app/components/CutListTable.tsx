import { useState } from 'react';

interface CutListRow {
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

interface CutList {
  fileName: string;
  data: CutListRow[];
}

interface CutListTableProps {
  cutLists: CutList[];
}

const CutListTable = ({ cutLists }: CutListTableProps) => {
  const [expandedTables, setExpandedTables] = useState<number[]>([0]); // First table expanded by default
  const [showConvertedDimensions, setShowConvertedDimensions] = useState(false);

  const toggleTable = (index: number) => {
    setExpandedTables(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="max-w-[90%] mx-auto px-4">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowConvertedDimensions(prev => !prev)}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <span>Convert Dimensions</span>
          <div className={`w-8 h-4 rounded-full relative ${showConvertedDimensions ? 'bg-green-500' : 'bg-gray-400'}`}>
            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showConvertedDimensions ? 'translate-x-4' : ''}`} />
          </div>
        </button>
      </div>
      {cutLists.map((cutList: CutList, index: number) => {
        // Sort the rows by "Length (cm)" in ascending order
        const sortedData = [...cutList.data].sort(
          (a, b) => b['Length (cm)'] - a['Length (cm)']
        );

        const isExpanded = expandedTables.includes(index);

        return (
          <div key={index} className="mb-8">
            <button
              onClick={() => toggleTable(index)}
              className="w-full text-left flex items-center justify-between text-white bg-gray-800 px-4 py-2 rounded-t-lg hover:bg-gray-700 transition-colors"
            >
              <span>{cutList.fileName}</span>
              <span className="text-xl">{isExpanded ? '▼' : '▶'}</span>
            </button>
            {isExpanded && (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border border-gray-300 whitespace-nowrap w-32">Part</th>
                      {showConvertedDimensions && (
                        <>
                          <th className="px-4 py-2 border border-gray-300 whitespace-nowrap w-24">Length (cm)</th>
                          <th className="px-4 py-2 border border-gray-300 whitespace-nowrap w-24">Width (cm)</th>
                          <th className="px-4 py-2 border border-gray-300 whitespace-nowrap w-24">Thick (cm)</th>
                          <th className="px-4 py-2 border border-gray-300 whitespace-nowrap w-24">Length (in)</th>
                          <th className="px-4 py-2 border border-gray-300 whitespace-nowrap w-24">Width (in)</th>
                          <th className="px-4 py-2 border border-gray-300 whitespace-nowrap w-24">Thick (in)</th>
                        </>
                      )}
                      <th className="px-4 py-2 border border-gray-300 whitespace-nowrap w-32">Length (frac)</th>
                      <th className="px-4 py-2 border border-gray-300 whitespace-nowrap w-32">Width (frac)</th>
                      <th className="px-4 py-2 border border-gray-300 whitespace-nowrap w-32">Thick (frac)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((row: CutListRow, rowIndex: number) => (
                      <tr
                        key={`${index}-${rowIndex}`}
                        className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-4 py-2 border border-gray-300 text-center whitespace-nowrap">{row.Part}</td>
                        {showConvertedDimensions && (
                          <>
                            <td className="px-4 py-2 border border-gray-300 text-center whitespace-nowrap">{row['Length (cm)']}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center whitespace-nowrap">{row['Width (cm)']}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center whitespace-nowrap">{row['Thick (cm)']}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center whitespace-nowrap">{row['Length (in)']}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center whitespace-nowrap">{row['Width (in)']}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center whitespace-nowrap">{row['Thick (in)']}</td>
                          </>
                        )}
                        <td className="px-4 py-2 border border-gray-300 text-center whitespace-nowrap">{row['Length (fractional in)']}</td>
                        <td className="px-4 py-2 border border-gray-300 text-center whitespace-nowrap">{row['Width (fractional in)']}</td>
                        <td className="px-4 py-2 border border-gray-300 text-center whitespace-nowrap">{row['Thick (fractional in)']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CutListTable;
