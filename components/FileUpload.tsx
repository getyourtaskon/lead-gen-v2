'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onDataUploaded: (data: Record<string, unknown>[]) => void;
}

export default function FileUpload({ onDataUploaded }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError('');

    try {
      let data: Record<string, unknown>[] = [];

      if (file.name.endsWith('.csv')) {
        // Parse CSV
        const text = await file.text();
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });

        if (parsed.errors.length > 0) {
          throw new Error('Failed to parse CSV file');
        }

        data = parsed.data as Record<string, unknown>[];
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Parse Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];
      } else {
        throw new Error('Please upload a CSV or Excel file');
      }

      if (data.length === 0) {
        throw new Error('File is empty');
      }

      onDataUploaded(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Your Data</h2>
        <p className="text-slate-600 mb-4">
          Drag and drop your CSV or Excel file here, or click to browse
        </p>
        <p className="text-sm text-slate-500">
          Supported formats: .csv, .xlsx, .xls
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file);
          }
        }}
        className="hidden"
      />

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">Processing file...</p>
        </div>
      )}
    </div>
  );
}
