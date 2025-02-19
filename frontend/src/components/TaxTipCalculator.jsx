import React, { useState } from 'react';

export default function TaxTipCalculator({ subtotal, tax, onTipChange }) {
  const [tipType, setTipType] = useState('percentage');
  const [tipPercentage, setTipPercentage] = useState(18);
  const [customTip, setCustomTip] = useState('');

  const handleTipChange = (value, type = 'percentage') => {
    if (type === 'percentage') {
      setTipType('percentage');
      setTipPercentage(value);
      onTipChange((subtotal * (value / 100)));
    } else {
      setTipType('custom');
      setCustomTip(value);
      onTipChange(parseFloat(value) || 0);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
      <h3 className="font-medium text-white mb-4">Add Tip</h3>
      
      {/* Percentage Buttons */}
      <div className="flex gap-2 mb-4">
        {[18, 20, 22].map((percent) => (
          <button
            key={percent}
            onClick={() => handleTipChange(percent)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors
              ${tipType === 'percentage' && tipPercentage === percent
                ? 'bg-purple-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            {percent}%
          </button>
        ))}
      </div>

      {/* Custom Tip Input */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-400">$</span>
        <input
          type="number"
          value={tipType === 'custom' ? customTip : ''}
          onChange={(e) => handleTipChange(e.target.value, 'custom')}
          placeholder="Custom tip amount"
          className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 
                   text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Summary */}
      <div className="space-y-2 text-sm text-gray-400 border-t border-gray-700 pt-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-white">
          <span>Tip:</span>
          <span>${tipType === 'percentage' ? ((subtotal * tipPercentage) / 100).toFixed(2) : (parseFloat(customTip) || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-white font-medium pt-2 border-t border-gray-700">
          <span>Total:</span>
          <span>${(subtotal + tax + (tipType === 'percentage' ? (subtotal * tipPercentage / 100) : (parseFloat(customTip) || 0))).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
} 