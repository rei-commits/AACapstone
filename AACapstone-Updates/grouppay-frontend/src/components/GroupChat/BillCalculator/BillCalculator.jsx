import React, { useState } from 'react';
import TipSection from './TipSection';
import DiscountSection from './DiscountSection';
import TotalSection from './TotalSection';

const BillCalculator = ({ isOpen, onClose, subtotal = 0 }) => {
  const [tip, setTip] = useState(0);
  const [includedTip, setIncludedTip] = useState(0);
  const [discount, setDiscount] = useState(0);

  const total = subtotal + tip + includedTip - discount;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-3xl transform transition-transform duration-300 
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="p-6">
        {/* Bill Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Bill Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Subtotal Section */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          <DiscountSection 
            includedTip={includedTip}
            onIncludedTipChange={setIncludedTip}
            discount={discount}
            onDiscountChange={setDiscount}
          />
        </div>

        <TipSection 
          subtotal={subtotal}
          onTipChange={setTip}
        />

        <TotalSection 
          tip={tip}
          total={total}
        />
      </div>
    </div>
  );
};

export default BillCalculator; 