'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataPreviewProps {
  data: Record<string, unknown>[];
  onNext: () => void;
  onBack: () => void;
}

export default function DataPreview({ data, onNext, onBack }: DataPreviewProps) {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const previewRows = data.slice(0, 5);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Data Preview</h2>
        <p className="text-slate-600">
          {data.length} rows, {columns.length} columns
        </p>
      </div>

      {/* Table Preview */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg mb-6">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-sm font-semibold text-slate-900"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3 text-sm text-slate-700">
                    {String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 5 && (
        <p className="text-sm text-slate-500 mb-6">
          Showing first 5 of {data.length} rows
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
