import React from 'react';

const TotalSection = ({ tip, total }) => {
  return (
    <div className="border-t pt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Tip</span>
        <span className="font-medium">${tip.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center text-lg font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default TotalSection; 