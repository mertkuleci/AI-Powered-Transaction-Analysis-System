import React, { useState } from 'react';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);

  // Tabs: "merchant" (default) or "patterns"
  const [activeTab, setActiveTab] = useState('merchant');

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a CSV file first.');
      return;
    }

    setUploadError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Update URL to match your deployed backend route
      const response = await fetch('http://localhost:3000/api/analyze/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setAnalysisResults(data);
    } catch (error) {
      setUploadError(error.message);
    }
  };

  let totalTransactions = 0;
  let totalSpend = 0;
  if (analysisResults && analysisResults.normalized_transactions) {
    totalTransactions = analysisResults.normalized_transactions.length;
    totalSpend = analysisResults.normalized_transactions.reduce((sum, tx) => {
      return sum + Math.abs(tx.normalized.amount || 0);
    }, 0);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Transaction Analyzer</h1>

      {/* UPLOAD SECTION */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload CSV</h2>
        
        {/* Stylish File Select */}
        <div className="flex flex-col items-start space-y-2 mb-4">
          {/* Label that acts like a button */}
          <label
            htmlFor="fileInput"
            className="inline-block cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Select CSV File
          </label>
          {/* Hidden file input */}
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          {/* Show selected filename */}
          {file ? (
            <p className="text-sm text-gray-700">
              Selected file: {file.name}
            </p>
          ) : (
            <p className="text-sm text-gray-400">No file selected</p>
          )}
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload and Analyze
        </button>
        
        {uploadError && (
          <p className="mt-4 text-red-500">{uploadError}</p>
        )}
      </div>

      {/* RESULTS SECTION */}
      {analysisResults && (
        <div className="bg-white rounded-lg shadow p-6">
          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-500 text-sm">Total Spend</p>
              <p className="text-2xl font-bold">${totalSpend.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Transactions</p>
              <p className="text-2xl font-bold">{totalTransactions}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Merchants</p>
              <p className="text-2xl font-bold">
                {countUniqueMerchants(analysisResults.normalized_transactions)}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b mb-4">
            {/* MERCHANT TAB BUTTON */}
            <button
              onClick={() => setActiveTab('merchant')}
              className={
                activeTab === 'merchant'
                  ? 'py-2 px-4 border-b-2 border-black font-semibold'
                  : 'py-2 px-4 text-gray-500 hover:text-black'
              }
            >
              Merchant Analysis
            </button>
            {/* PATTERN TAB BUTTON */}
            <button
              onClick={() => setActiveTab('patterns')}
              className={
                activeTab === 'patterns'
                  ? 'py-2 px-4 border-b-2 border-black font-semibold'
                  : 'py-2 px-4 text-gray-500 hover:text-black'
              }
            >
              Pattern Detection
            </button>
          </div>

          {/* MERCHANT ANALYSIS (visible if activeTab = 'merchant') */}
          {activeTab === 'merchant' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Normalized Merchants</h2>
              <p className="text-gray-600 text-sm mb-4">
                AI-powered merchant name normalization
              </p>
              <div className="space-y-4">
                {analysisResults.normalized_transactions.map((tx, index) => {
                  const {
                    merchant,
                    category,
                    sub_category,
                    confidence,
                    flags,
                    amount,
                  } = tx.normalized;

                  return (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      {/* Original vs Normalized */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-sm text-gray-500 uppercase">
                            Original
                          </h3>
                          <p className="text-base font-medium">{tx.original}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 text-xs block">
                            Normalized
                          </span>
                          <span className="text-base font-semibold">
                            {merchant}
                          </span>
                        </div>
                      </div>
                      {/* Category badges */}
                      <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
                        <span className="px-2 py-1 bg-gray-200 rounded">
                          {category}
                        </span>
                        {sub_category !== 'N/A' && (
                          <span className="px-2 py-1 bg-gray-200 rounded">
                            {sub_category}
                          </span>
                        )}
                        {flags.map((flag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-100 text-blue-600 rounded"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                      {/* Confidence & Amount */}
                      <div className="mt-2 text-sm text-gray-500">
                        Confidence: {(confidence * 100).toFixed(0)}% &nbsp;|&nbsp; 
                        Amount: {amount ? `$${amount}` : 'N/A'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PATTERN DETECTION (visible if activeTab = 'patterns') */}
          {activeTab === 'patterns' && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Detected Patterns</h2>
              <p className="text-gray-600 text-sm mb-4">
                Subscription and recurring payment detection
              </p>
              <div className="space-y-4">
                {analysisResults.detected_patterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold">
                        {pattern.merchant}
                      </h3>
                      <p className="text-right font-medium">
                        {pattern.amount > 0
                          ? `$${pattern.amount}`
                          : `-$${Math.abs(pattern.amount)}`}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {pattern.type} &bull; {pattern.frequency}
                    </p>
                    {pattern.next_expected && (
                      <p className="text-sm text-gray-500 mt-1">
                        Next: {pattern.next_expected}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper to count unique merchants
function countUniqueMerchants(normalizedTxs) {
  const set = new Set();
  normalizedTxs.forEach((tx) => {
    set.add(tx.normalized.merchant);
  });
  return set.size;
}

export default UploadPage;
