import React from 'react';

const PaymentSummary = ({ amount, items }) => {
  return (
    <div className="mb-6">
      <h4 className="font-medium text-gray-700 mb-3">Payment Summary</h4>
      <div className="bg-gray-50 rounded-xl p-4">
        {items && items.length > 0 && (
          <div className="space-y-2 mb-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2"></div>
          </div>
        )}
        
        <div className="flex justify-between font-medium">
          <span>Total Amount</span>
          <span className="text-indigo-600">${amount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary; 