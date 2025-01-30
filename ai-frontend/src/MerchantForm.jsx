import React, { useState } from 'react';

export default function MerchantForm() {
  const [description, setDescription] = useState('AMZN MKTP US*Z1234ABC');
  const [amount, setAmount] = useState('-89.97');
  const [date, setDate] = useState('2024-01-15');
  const [response, setResponse] = useState(null);

  const handleSubmit = async () => {
    const cleanedAmount = amount.replace(',', '.');

    try {
      const res = await fetch('http://localhost:3000/api/analyze/merchant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          amount: parseFloat(cleanedAmount),
          date,
        }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error(error);
    }
  };

  const merchantData = response?.normalized;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl mx-auto my-4">
      <h2 className="text-2xl font-bold mb-4">Merchant Normalization</h2>

      {/* Input Fields */}
      <div className="mb-2">
        <label className="block font-semibold">Description</label>
        <input
          className="border p-2 rounded w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
        />
      </div>

      <div className="mb-2">
        <label className="block font-semibold">Amount</label>
        <input
          className="border p-2 rounded w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          step="0.01"
        />
      </div>

      <div className="mb-2">
        <label className="block font-semibold">Date</label>
        <input
          className="border p-2 rounded w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
        />
      </div>

      {/* Submit Button */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={handleSubmit}
      >
        Analyze
      </button>

      {/* Results */}
      {merchantData && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Normalization Result</h3>
          <div className="flex justify-between mb-2">
            <div>
              <p className="text-sm text-gray-500">Merchant</p>
              <p className="font-medium">{merchantData.merchant}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Confidence</p>
              <p className="font-medium">
                {(merchantData.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
            <span className="px-2 py-1 bg-gray-200 rounded">
              {merchantData.category}
            </span>
            {merchantData.sub_category !== 'N/A' && (
              <span className="px-2 py-1 bg-gray-200 rounded">
                {merchantData.sub_category}
              </span>
            )}
            {/* Flags as badges */}
            {merchantData.flags?.map((flag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-100 text-blue-600 rounded"
              >
                {flag}
              </span>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            Is Subscription?{' '}
            <span className="font-medium">
              {merchantData.is_subscription ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="text-sm text-gray-500">
            Amount:{' '}
            <span className="font-medium">
              {merchantData.amount !== undefined
                ? `$${merchantData.amount}`
                : 'N/A'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
