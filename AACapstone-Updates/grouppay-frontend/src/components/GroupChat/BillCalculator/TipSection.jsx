import React, { useState } from 'react';

const TipSection = ({ subtotal, onTipChange }) => {
  const [selectedTip, setSelectedTip] = useState(null);

  const handleTipSelect = (percentage) => {
    setSelectedTip(percentage);
    const tipAmount = (subtotal * percentage) / 100;
    onTipChange(tipAmount);
  };

  const handleCustomTip = () => {
    const customTip = prompt('Enter tip amount:');
    if (customTip && !isNaN(customTip)) {
      setSelectedTip('custom');
      onTipChange(parseFloat(customTip));
    }
  };

  return (
    <div className="mb-6">
      <h4 className="text-gray-700 font-medium mb-3">Tip your server</h4>
      <div className="flex gap-2 mb-3">
        {[15, 18, 20].map((percentage) => (
          <button
            key={percentage}
            onClick={() => handleTipSelect(percentage)}
            className={`tip-btn flex-1 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 
              ${selectedTip === percentage ? 'bg-indigo-600 text-white' : ''}`}
          >
            {percentage}%
          </button>
        ))}
      </div>
      <button
        onClick={handleCustomTip}
        className="w-full py-2 text-indigo-600 hover:text-indigo-700"
      >
        Enter custom amount
      </button>
    </div>
  );
};

export default TipSection; 