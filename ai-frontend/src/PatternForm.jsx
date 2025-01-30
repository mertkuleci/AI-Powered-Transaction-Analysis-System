import React, { useState } from 'react';

export default function PatternForm() {
  const [transactions, setTransactions] = useState([
    { description: 'NETFLIX', amount: '-19.99', date: '2024-01-01' },
  ]);
  const [response, setResponse] = useState(null);

  const handleChange = (index, field, value) => {
    const updated = [...transactions];
    updated[index][field] = value;
    setTransactions(updated);
  };

  const addTransaction = () => {
    setTransactions([...transactions, { description: '', amount: '', date: '' }]);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/analyze/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error(error);
    }
  };

  // If we received data in { patterns: [...] } format, store it
  const patterns = response?.patterns || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl mx-auto my-4">
      <h2 className="text-2xl font-bold mb-4">Pattern Detection</h2>

      {/* Transaction Inputs */}
      {transactions.map((tx, idx) => (
        <div className="flex space-x-2 mb-2" key={idx}>
          <input
            type="text"
            value={tx.description}
            className="border p-2 rounded w-1/2"
            placeholder="Description"
            onChange={(e) => handleChange(idx, 'description', e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            value={tx.amount}
            className="border p-2 rounded w-1/4"
            placeholder="Amount"
            onChange={(e) => handleChange(idx, 'amount', e.target.value)}
          />
          <input
            type="date"
            value={tx.date}
            className="border p-2 rounded w-1/4"
            onChange={(e) => handleChange(idx, 'date', e.target.value)}
          />
        </div>
      ))}

      <button
        onClick={addTransaction}
        className="bg-gray-300 text-black px-3 py-1 rounded mr-2 hover:bg-gray-400"
      >
        Add Transaction
      </button>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Detect Patterns
      </button>

      {/* Results */}
      {patterns.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Detected Patterns</h3>
          <div className="space-y-4">
            {patterns.map((p, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded border border-gray-300 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">{p.merchant}</h4>
                  <span className="text-sm text-gray-500">
                    Confidence: {(p.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Type: <span className="font-medium">{p.type}</span> &bull;{' '}
                  Frequency:{' '}
                  <span className="font-medium">{p.frequency || 'N/A'}</span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Amount:{' '}
                  <span className="font-medium">
                    {p.amount > 0 ? `$${p.amount}` : `-$${Math.abs(p.amount)}`}
                  </span>
                </div>
                {p.next_expected && (
                  <div className="mt-1 text-sm text-gray-500">
                    Next Expected: <span className="font-medium">{p.next_expected}</span>
                  </div>
                )}
                {p.notes && (
                  <div className="mt-1 text-sm text-gray-500">
                    Notes: <span className="font-medium">{p.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
