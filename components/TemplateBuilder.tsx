'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

interface TemplateBuilderProps {
  data: Record<string, unknown>[];
  onNext: (template: string, fields: PersonalizationField[]) => void;
  onBack: () => void;
}

interface PersonalizationField {
  id: string;
  column: string;
  placeholder: string;
}

export default function TemplateBuilder({ data, onNext, onBack }: TemplateBuilderProps) {
  const [template, setTemplate] = useState('');
  const [personalizationFields, setPersonalizationFields] = useState<PersonalizationField[]>([]);
  const [selectedColumn, setSelectedColumn] = useState('');

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const sampleRow = data[0] || {};

  const addPersonalizationField = () => {
    if (!selectedColumn) return;

    const newField: PersonalizationField = {
      id: Math.random().toString(36).substr(2, 9),
      column: selectedColumn,
      placeholder: `{${selectedColumn}}`,
    };

    setPersonalizationFields([...personalizationFields, newField]);
    setSelectedColumn('');
  };

  const removePersonalizationField = (id: string) => {
    setPersonalizationFields(personalizationFields.filter((f) => f.id !== id));
  };

  const insertPlaceholder = (placeholder: string) => {
    setTemplate(template + placeholder);
  };

  const getPreview = () => {
    let preview = template;
    personalizationFields.forEach((field) => {
      preview = preview.replace(field.placeholder, String(sampleRow[field.column] ?? ''));
    });
    return preview;
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Build Template</h2>
        <p className="text-slate-600">
          Create your message template with personalization tags
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Panel - Available Fields */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Available Fields</h3>
            <div className="space-y-2">
              {columns.map((col) => (
                <button
                  key={col}
                  onClick={() => insertPlaceholder(`{${col}}`)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm text-left"
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">Personalization</h3>
            <div className="space-y-2 mb-3">
              <label className="block text-sm font-medium text-slate-700">
                Add field
              </label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column...</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={addPersonalizationField}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Field
            </button>
          </div>
        </div>

        {/* Center Panel - Template Editor */}
        <div className="lg:col-span-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message Template
            </label>
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Hi {name}, I noticed your work at {company}..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={8}
            />
          </div>

          {/* Selected Personalization Fields */}
          {personalizationFields.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                Active Personalizations
              </h4>
              <div className="flex flex-wrap gap-2">
                {personalizationFields.map((field) => (
                  <div
                    key={field.id}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <code className="font-mono">{field.placeholder}</code>
                    <button
                      onClick={() => removePersonalizationField(field.id)}
                      className="hover:text-blue-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Preview (with first row)</h4>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-slate-700 whitespace-pre-wrap">{getPreview()}</p>
            </div>
          </div>
        </div>
      </div>

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
          onClick={() => onNext(template, personalizationFields)}
          disabled={!template.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
