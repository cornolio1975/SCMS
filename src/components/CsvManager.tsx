'use client';

import { useState } from 'react';

type CsvManagerProps = {
  moduleName: string;
  onImportComplete?: () => void;
};

export default function CsvManager({ moduleName, onImportComplete }: CsvManagerProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('export');
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Upload, 2: Mapping, 3: Validation, 4: Summary

  const handleExport = (type: 'all' | 'filtered' | 'selected' | 'template') => {
    // In a real app, this would trigger an API call to download the CSV
    console.log(`Exporting ${type} for ${moduleName}`);
    alert(`Started export: ${type} for ${moduleName}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processImport = async () => {
    // Simulate API call for CSV processing with transactions and conflict detection
    setStep(3);
    setTimeout(() => {
      setStep(4);
    }, 2000);
  };

  const confirmImport = () => {
    alert('Import confirmed. Database transaction committed.');
    if (onImportComplete) onImportComplete();
    setStep(1);
    setFile(null);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex border-b mb-4">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'export' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('export')}
        >
          Export CSV
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'import' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('import')}
        >
          Import CSV
        </button>
      </div>

      {activeTab === 'export' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Download data from the {moduleName} module. Stable identifiers are included to allow two-way sync.</p>
          <div className="flex gap-4">
            <button onClick={() => handleExport('all')} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm">Export All</button>
            <button onClick={() => handleExport('filtered')} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm">Export Current View</button>
            <button onClick={() => handleExport('selected')} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm">Export Selected</button>
            <button onClick={() => handleExport('template')} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded text-sm">Download Template</button>
          </div>
        </div>
      )}

      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div>
              <p className="text-sm text-gray-600 mb-4">Upload a CSV file to create or update records. We use stable IDs to match existing records safely.</p>
              <input type="file" accept=".csv" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              <button 
                onClick={() => setStep(2)} 
                disabled={!file}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Next: Map Columns
              </button>
            </div>
          )}

          {/* Step 2: Mapping */}
          {step === 2 && (
            <div>
              <h4 className="font-medium mb-2">Map Columns (Mock)</h4>
              <p className="text-sm text-gray-500 mb-4">Map your CSV columns to database fields. Required fields must be mapped.</p>
              <button onClick={processImport} className="bg-indigo-600 text-white px-4 py-2 rounded">Validate Data</button>
            </div>
          )}

          {/* Step 3: Validation Loading */}
          {step === 3 && (
            <div className="py-8 text-center text-gray-600">
              Validating rows, checking for duplicates, and detecting conflicts...
            </div>
          )}

          {/* Step 4: Summary and Confirm */}
          {step === 4 && (
            <div>
              <h4 className="font-medium text-lg mb-2">Validation Summary</h4>
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <span className="block text-gray-500">Total Rows</span>
                  <span className="font-bold text-lg">12</span>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <span className="block text-gray-500">New / Updates</span>
                  <span className="font-bold text-lg text-green-700">10</span>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <span className="block text-gray-500">Conflicts Detected</span>
                  <span className="font-bold text-lg text-yellow-700">2</span>
                </div>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-sm text-yellow-700">2 conflicts detected (e.g. newer data in database). Please review before confirming.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded">Cancel</button>
                <button onClick={confirmImport} className="bg-indigo-600 text-white px-4 py-2 rounded font-medium">Confirm & Commit Transaction</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
