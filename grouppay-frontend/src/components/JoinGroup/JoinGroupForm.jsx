import React, { useState } from 'react';

const JoinGroupForm = ({ onSubmit }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(code);
  };

  return (
    <div className="w-full max-w-md mx-4">
      <h1 className="text-white text-3xl font-semibold text-center mb-6">
        Join a Group
      </h1>
      
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 mb-2 font-medium">
              Enter Group Code
            </label>
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
              maxLength={6}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Join Group
          </button>

          <button 
            type="button"
            onClick={() => window.location.href = '/'}
            className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinGroupForm; 