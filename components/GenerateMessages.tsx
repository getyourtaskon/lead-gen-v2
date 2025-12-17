'use client';

import { useState, useEffect } from 'react';
import { Download, Copy, Zap } from 'lucide-react';
import { useMessageGeneration } from '@/hooks/useMessageGeneration';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface PersonalizationField {
  id: string;
  column: string;
  placeholder: string;
}

interface GenerateMessagesProps {
  template: string;
  personalizationFields: PersonalizationField[];
  data: Record<string, unknown>[];
  onBack: () => void;
}

export default function GenerateMessages({
  template,
  personalizationFields,
  data,
  onBack,
}: GenerateMessagesProps) {
  const { isLoading, error, messages, progress, generate } = useMessageGeneration();
  const [useAI, setUseAI] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'original' | 'enhanced'>('original');

  const displayMessages = messages.map((msg) => ({
    ...msg,
    text: viewMode === 'enhanced' && msg.enhanced ? msg.enhanced : msg.original,
  }));

  const handleGenerate = async () => {
    setHasGenerated(true);
    await generate(template, personalizationFields, data, useAI);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportToCSV = () => {
    const rows = displayMessages.map((msg, idx) => ({
      'Message #': idx + 1,
      'Message': msg.text,
      ...msg.row,
    }));

    const csv = Papa.unparse(rows);
    downloadFile(csv, 'messages.csv', 'text/csv');
  };

  const exportToExcel = () => {
    const rows = displayMessages.map((msg, idx) => ({
      'Message #': idx + 1,
      'Message': msg.text,
      ...msg.row,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Messages');
    XLSX.writeFile(workbook, 'messages.xlsx');
  };

  const exportToText = () => {
    const text = displayMessages.map((msg, idx) => `Message ${idx + 1}:\n${msg.text}`).join('\n\n---\n\n');
    downloadFile(text, 'messages.txt', 'text/plain');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Generate Messages</h2>
        <p className="text-slate-600">
          Create personalized messages for {data.length} leads
        </p>
      </div>

      {!hasGenerated ? (
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Generation Options</h3>

          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <span className="text-slate-700">
              <div className="font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Enhance with AI
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Uses Claude to improve each message for better engagement (requires API key)
              </p>
            </span>
          </label>

          <button
            onClick={handleGenerate}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Generate {data.length} Messages
          </button>
        </div>
      ) : null}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            <p className="text-blue-800 font-medium">Generating messages...</p>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <>
          <div className="mb-6 flex gap-3 justify-between items-center flex-wrap">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('original')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'original'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Original
              </button>
              {messages.some((m) => m.enhanced) && (
                <button
                  onClick={() => setViewMode('enhanced')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    viewMode === 'enhanced'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Enhanced
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
              <button
                onClick={exportToText}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Text
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {displayMessages.map((message, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h4 className="font-semibold text-slate-900">Message {idx + 1}</h4>
                  <button
                    onClick={() => copyToClipboard(message.text, idx)}
                    className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedIndex === idx ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap mb-3">{message.text}</p>
                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                  {Object.entries(message.row)
                    .slice(0, 3)
                    .map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {messages.length === 0 && hasGenerated && !isLoading && !error && (
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">Click &quot;Generate&quot; to create personalized messages</p>
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Generate Messages
          </button>
        </div>
      )}

      {messages.length === 0 && !hasGenerated && (
        <div className="text-center py-12">
          <p className="text-slate-600">Configure options and generate your personalized messages</p>
        </div>
      )}
    </div>
  );
}
