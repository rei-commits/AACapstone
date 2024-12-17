import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-1/4 hidden md:block">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50">
        {/* Profile Section */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative group">
            <div className="rounded-full w-full h-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              JS
            </div>
          </div>
          <p className="text-gray-600 mb-2 font-medium">Member since:</p>
          <div className="bg-indigo-50 rounded-lg px-3 py-2 text-indigo-700 font-medium">Jan 2023</div>
        </div>

        {/* Friends Section */}
        <div className="mt-8">
          <h5 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <i className="fas fa-users text-indigo-600"></i>
            Friends
          </h5>
          <select className="w-full px-4 py-2 border rounded-xl bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option>Select a friend</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
          </select>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <h5 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <i className="fas fa-history text-indigo-600"></i>
            Transaction History
          </h5>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer border border-transparent hover:border-indigo-100">
              <span className="text-gray-700">Transaction 1</span>
              <i className="fas fa-chevron-right text-indigo-400"></i>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer border border-transparent hover:border-indigo-100">
              <span className="text-gray-700">Transaction 2</span>
              <i className="fas fa-chevron-right text-indigo-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 