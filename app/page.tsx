'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import DataPreview from '@/components/DataPreview';
import TemplateBuilder from '@/components/TemplateBuilder';
import GenerateMessages from '@/components/GenerateMessages';

interface PersonalizationField {
  id: string;
  column: string;
  placeholder: string;
}

export default function Home() {
  const [uploadedData, setUploadedData] = useState<Record<string, unknown>[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'template' | 'generate'>('upload');
  const [template, setTemplate] = useState('');
  const [personalizationFields, setPersonalizationFields] = useState<PersonalizationField[]>([]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Lead Gen Machine</h1>
          <p className="text-slate-600">Create personalized outreach messages at scale</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 flex gap-4">
          {[
            { step: 'upload', label: 'Upload Data' },
            { step: 'preview', label: 'Preview' },
            { step: 'template', label: 'Build Template' },
            { step: 'generate', label: 'Generate' },
          ].map((item) => (
            <div
              key={item.step}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === item.step
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {currentStep === 'upload' && (
            <FileUpload
              onDataUploaded={(data) => {
                setUploadedData(data);
                setCurrentStep('preview');
              }}
            />
          )}

          {currentStep === 'preview' && (
            <DataPreview
              data={uploadedData}
              onNext={() => setCurrentStep('template')}
              onBack={() => setCurrentStep('upload')}
            />
          )}

          {currentStep === 'template' && (
            <TemplateBuilder
              data={uploadedData}
              onNext={(tmpl, fields) => {
                setTemplate(tmpl);
                setPersonalizationFields(fields);
                setCurrentStep('generate');
              }}
              onBack={() => setCurrentStep('preview')}
            />
          )}

          {currentStep === 'generate' && (
            <GenerateMessages
              template={template}
              personalizationFields={personalizationFields}
              data={uploadedData}
              onBack={() => setCurrentStep('template')}
            />
          )}
        </div>
      </div>
    </main>
  );
}
