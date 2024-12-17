import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuickSplitBill = () => {
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState('');
  const [people, setPeople] = useState([{ name: '', amount: '' }]);
  const [splitType, setSplitType] = useState('equal'); // 'equal' or 'custom'

  const addPerson = () => {
    setPeople([...people, { name: '', amount: '' }]);
  };

  const removePerson = (index) => {
    const newPeople = people.filter((_, i) => i !== index);
    setPeople(newPeople);
  };

  const updatePerson = (index, field, value) => {
    const newPeople = [...people];
    newPeople[index][field] = value;
    setPeople(newPeople);
  };

  const calculateSplit = () => {
    if (splitType === 'equal') {
      const amountPerPerson = (parseFloat(totalAmount) / people.length).toFixed(2);
      const newPeople = people.map(person => ({
        ...person,
        amount: amountPerPerson
      }));
      setPeople(newPeople);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quick Split</h1>
          <p className="text-gray-600">Split bills instantly - no account needed</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Total Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Amount
            </label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="Enter total amount"
              className="w-full text-3xl p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Split Type Selection */}
          <div className="mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setSplitType('equal')}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  splitType === 'equal' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Split Equally
              </button>
              <button
                onClick={() => setSplitType('custom')}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  splitType === 'custom' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Custom Split
              </button>
            </div>
          </div>

          {/* People List */}
          <div className="space-y-4">
            {people.map((person, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => updatePerson(index, 'name', e.target.value)}
                  placeholder="Name"
                  className="flex-1 p-2 border rounded-lg"
                />
                {splitType === 'custom' && (
                  <input
                    type="number"
                    value={person.amount}
                    onChange={(e) => updatePerson(index, 'amount', e.target.value)}
                    placeholder="Amount"
                    className="w-32 p-2 border rounded-lg"
                  />
                )}
                {people.length > 1 && (
                  <button
                    onClick={() => removePerson(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Person Button */}
          <button
            onClick={addPerson}
            className="mt-4 w-full py-2 text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Person
          </button>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateSplit}
          className="w-full btn-primary py-3 text-lg"
        >
          Calculate Split
        </button>

        {/* Share Results */}
        <div className="mt-6 text-center">
          <button className="text-indigo-600 hover:text-indigo-700">
            Share Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickSplitBill; 