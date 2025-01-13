import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiDownload, FiChevronDown, FiArrowUp, FiArrowDown, FiArrowLeft, FiTrendingUp } from 'react-icons/fi';

/**
 * Activity Component
 * Displays user's transaction history and current balance
 * Features:
 * - Shows available balance with trend indicator
 * - Displays monthly received/sent amounts
 * - Provides transaction filtering and search
 * - Lists all transactions with details
 */
const Activity = () => {
  const navigate = useNavigate();
  
  // State for filtering and searching transactions
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Available filter options for transactions
  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'sent', label: 'Sent' },
    { id: 'received', label: 'Received' },
    { id: 'split', label: 'Split Bills' }
  ];

  // Mock transaction data
  // Each transaction includes: type, title, amount, date, status, and category
  const transactions = [
    {
      id: 1,
      type: 'sent',
      title: 'Sent to Charly',
      amount: -12.84,
      date: 'Today, 2:30 PM',
      status: 'Completed',
      category: 'Transfer'
    },
    {
      id: 2,
      type: 'received',
      title: 'Received from Jonel',
      amount: 17.12,
      date: 'Today, 10:15 AM',
      status: 'Completed',
      category: 'Transfer'
    },
    {
      id: 3,
      type: 'sent',
      title: 'Sent to Tiana',
      amount: -15.50,
      date: 'Yesterday',
      status: 'Completed',
      category: 'Transfer'
    }
  ];

  // Filter transactions based on selected filter and search query
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by transaction type if not showing all
    if (selectedFilter !== 'all' && transaction.type !== selectedFilter) return false;
    // Filter by search query if one exists
    if (searchQuery && !transaction.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section with Gradient Background */}
      <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
        <div className="max-w-7xl mx-auto">
          <div className="p-4">
            <div className="flex items-center gap-4">
              {/* Back Button with Animation */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 
                         transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
              <h1 className="text-2xl font-bold text-white">Activity</h1>
            </div>
          </div>

          {/* Balance Card Section */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 
                         rounded-2xl p-6 text-white shadow-xl">
              {/* Available Balance Display */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 mb-1">Available Balance</p>
                  <h2 className="text-3xl font-bold">$84.32</h2>
                </div>
                {/* Balance Trend Indicator */}
                <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                  <FiTrendingUp className="w-4 h-4 text-green-400" aria-hidden="true" />
                  <span className="text-sm text-green-400" aria-label="Balance increased by 1.2 percent">+1.2%</span>
                </div>
              </div>
              {/* Monthly Transaction Summary */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">This Month</p>
                  <div className="flex items-center gap-2 mt-1">
                    {/* Received Amount */}
                    <div className="flex items-center gap-1 text-green-400">
                      <FiArrowDown className="w-4 h-4" />
                      <span>$29.96</span>
                    </div>
                    <span className="text-gray-500">|</span>
                    {/* Sent Amount */}
                    <div className="flex items-center gap-1 text-red-400">
                      <FiArrowUp className="w-4 h-4" />
                      <span>$28.34</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          {/* Filter Controls */}
          <div className="flex gap-2">
            {/* Transaction Type Filter */}
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
              >
                {filterOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {/* Additional Filter Button */}
            <button className="p-2 rounded-xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              <FiFilter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            {/* Download Transactions Button */}
            <button className="p-2 rounded-xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              <FiDownload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md
                       transition-all duration-200"
            >
              {/* Transaction Item Layout */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Transaction Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                ${transaction.type === 'received' 
                                  ? 'bg-green-100 dark:bg-green-900/30' 
                                  : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {transaction.type === 'received' 
                      ? <FiArrowDown className="w-5 h-5 text-green-600 dark:text-green-400" />
                      : <FiArrowUp className="w-5 h-5 text-red-600 dark:text-red-400" />}
                  </div>
                  {/* Transaction Details */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{transaction.title}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                      <span className="text-sm px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Transaction Amount and Status */}
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.amount > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} USD
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.status}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activity; 