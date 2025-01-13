import React, { useState } from 'react';
import { FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';

const InstaSplit = () => {
  const [amount, setAmount] = useState('');
  const [numPeople, setNumPeople] = useState(2);
  const [tax, setTax] = useState(0);
  const [tip, setTip] = useState(0);
  const [splitType, setSplitType] = useState('equal'); // 'equal' or 'custom'

  const handleNumPeopleChange = (change) => {
    const newValue = numPeople + change;
    if (newValue >= 2) setNumPeople(newValue);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(amount) || 0;
    const taxAmount = subtotal * (tax / 100);
    const tipAmount = subtotal * (tip / 100);
    return subtotal + taxAmount + tipAmount;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button className="text-white">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-white">InstaSplit</h1>
        <div className="w-6" /> {/* Spacer for alignment */}
      </div>

      <div className="mx-auto max-w-md space-y-6 p-4">
        {/* Total Amount */}
        <div>
          <label className="mb-2 block text-sm text-gray-300">Total Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg bg-gray-800 py-3 pl-8 pr-3 text-xl text-white"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Number of People */}
        <div>
          <label className="mb-2 block text-sm text-gray-300">Number of People</label>
          <div className="flex items-center gap-4 rounded-lg bg-gray-800 p-2">
            <button
              onClick={() => handleNumPeopleChange(-1)}
              className="rounded-md bg-gray-700 p-2 text-white hover:bg-gray-600"
            >
              <FiMinus />
            </button>
            <span className="flex-1 text-center text-xl text-white">{numPeople}</span>
            <button
              onClick={() => handleNumPeopleChange(1)}
              className="rounded-md bg-gray-700 p-2 text-white hover:bg-gray-600"
            >
              <FiPlus />
            </button>
          </div>
        </div>

        {/* Tax and Tip */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm text-gray-300">Tax (%)</label>
            <input
              type="number"
              value={tax}
              onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg bg-gray-800 py-2 px-3 text-white"
              placeholder="0"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-300">Tip (%)</label>
            <div className="flex gap-2">
              {[15, 18, 20].map((percentage) => (
                <button
                  key={percentage}
                  onClick={() => setTip(percentage)}
                  className={`flex-1 rounded-lg py-2 text-sm ${
                    tip === percentage ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {percentage}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Split Type */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSplitType('equal')}
            className={`rounded-lg py-2 px-4 ${
              splitType === 'equal' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            Equal Split
          </button>
          <button
            onClick={() => setSplitType('custom')}
            className={`rounded-lg py-2 px-4 ${
              splitType === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            Custom Split
          </button>
        </div>

        {/* Calculate Button */}
        <button className="w-full rounded-lg bg-indigo-600 py-3 text-white hover:bg-indigo-700">
          Calculate Split
        </button>
      </div>
    </div>
  );
};

export default InstaSplit; 