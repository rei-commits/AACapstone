import React from 'react';

const DiscountSection = ({ 
  includedTip, 
  onIncludedTipChange, 
  discount, 
  onDiscountChange 
}) => {
  const handleIncludedTip = () => {
    const tip = prompt('Enter included tip amount:');
    if (tip && !isNaN(tip)) {
      onIncludedTipChange(parseFloat(tip));
    }
  };

  const handleDiscount = () => {
    const amount = prompt('Enter discount amount:');
    if (amount && !isNaN(amount)) {
      onDiscountChange(parseFloat(amount));
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <button 
          onClick={handleIncludedTip}
          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <i className="fas fa-plus text-sm"></i>
          <span>Add included tip</span>
        </button>
        <span className="font-medium">${includedTip.toFixed(2)}</span>
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={handleDiscount}
          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <i className="fas fa-plus text-sm"></i>
          <span>Add discount</span>
        </button>
        <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
      </div>
    </>
  );
};

export default DiscountSection; 