import React from 'react';

const PaymentMethod = ({ id, name, icon, selected, onSelect }) => (
  <button
    onClick={() => onSelect(id)}
    className={`w-full p-4 rounded-xl border ${
      selected 
        ? 'border-indigo-600 bg-indigo-50' 
        : 'border-gray-200 hover:bg-gray-50'
    } flex items-center gap-4 transition-colors`}
  >
    <i className={`fas fa-${icon} text-xl ${selected ? 'text-indigo-600' : 'text-gray-400'}`} />
    <span className={selected ? 'text-indigo-600 font-medium' : 'text-gray-600'}>
      {name}
    </span>
  </button>
);

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
  const methods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
    { id: 'apple', name: 'Apple Pay', icon: 'apple' },
    { id: 'google', name: 'Google Pay', icon: 'google' },
    { id: 'paypal', name: 'PayPal', icon: 'paypal' },
  ];

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 mb-3">Select Payment Method</h4>
      {methods.map(method => (
        <PaymentMethod 
          key={method.id}
          {...method}
          selected={selectedMethod === method.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default PaymentMethodSelector; 