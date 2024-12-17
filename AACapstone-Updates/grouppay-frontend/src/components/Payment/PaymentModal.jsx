import React, { useState } from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentSummary from './PaymentSummary';

const PaymentModal = ({ isOpen, onClose, amount, items }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Payment</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <PaymentSummary amount={amount} items={items} />
        
        <PaymentMethodSelector 
          selectedMethod={selectedMethod}
          onSelect={setSelectedMethod}
        />

        <button 
          onClick={() => {/* Handle payment */}}
          disabled={!selectedMethod}
          className={`w-full py-3 rounded-lg mt-6 ${
            selectedMethod 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Pay ${amount.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal; 