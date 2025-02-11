import { useState, useEffect } from 'react';

export default function TaxTipCalculator({ subtotal, onUpdate }) {
  const [taxPercent, setTaxPercent] = useState(8.875);
  const [tipPercent, setTipPercent] = useState(18);

  useEffect(() => {
    const tax = (subtotal * taxPercent) / 100;
    const tip = (subtotal * tipPercent) / 100;
    onUpdate({ tax, tip });
  }, [subtotal, taxPercent, tipPercent]);

  return (
    <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tax ({taxPercent}%)</p>
        <input
          type="range"
          min="0"
          max="15"
          step="0.125"
          value={taxPercent}
          onChange={(e) => setTaxPercent(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tip ({tipPercent}%)</p>
        <div className="flex gap-2">
          {[15, 18, 20, 25].map((percent) => (
            <button
              key={percent}
              onClick={() => setTipPercent(percent)}
              className={`px-3 py-1 rounded-lg ${
                tipPercent === percent
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              {percent}%
            </button>
          ))}
        </div>
      </div>
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>${((subtotal * taxPercent) / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tip:</span>
          <span>${((subtotal * tipPercent) / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>Total:</span>
          <span>
            ${(subtotal + (subtotal * taxPercent) / 100 + (subtotal * tipPercent) / 100).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
} 