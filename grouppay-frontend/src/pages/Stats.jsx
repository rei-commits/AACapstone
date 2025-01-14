import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowUp, FiArrowDown, FiTrendingUp, FiTrendingDown, FiCalendar, FiArrowLeft } from 'react-icons/fi';

const Stats = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Stats data for different periods
  const statsData = {
    week: {
      totalSpent: 45.50,
      totalReceived: 25.68,
      percentageChange: 1.2,
      isPositive: true,
      categories: [
        { name: 'Food & Drinks', amount: 25.84, percentage: 56.8 },
        { name: 'Entertainment', amount: 12.99, percentage: 28.5 },
        { name: 'Shopping', amount: 4.98, percentage: 11.0 },
        { name: 'Transport', amount: 1.69, percentage: 3.7 }
      ]
    },
    month: {
      totalSpent: 168.42,
      totalReceived: 84.32,
      percentageChange: 3.2,
      isPositive: true,
      categories: [
        { name: 'Food & Drinks', amount: 82.84, percentage: 49.2 },
        { name: 'Entertainment', amount: 45.99, percentage: 27.3 },
        { name: 'Shopping', amount: 28.90, percentage: 17.2 },
        { name: 'Transport', amount: 10.69, percentage: 6.3 }
      ]
    },
    year: {
      totalSpent: 1284.32,
      totalReceived: 890.50,
      percentageChange: 8.4,
      isPositive: true,
      categories: [
        { name: 'Food & Drinks', amount: 625.84, percentage: 48.7 },
        { name: 'Entertainment', amount: 389.99, percentage: 30.4 },
        { name: 'Shopping', amount: 182.80, percentage: 14.2 },
        { name: 'Transport', amount: 85.69, percentage: 6.7 }
      ]
    }
  };

  // Get current stats based on selected period
  const stats = statsData[selectedPeriod];

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' }
  ];

  // Handle period change with animation reset
  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                         dark:hover:bg-gray-600 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stats</h1>
            </div>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                className="appearance-none pl-4 pr-10 py-2 rounded-xl border border-gray-200 
                         dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 
                         focus:ring-indigo-500"
              >
                {periods.map(period => (
                  <option key={period.id} value={period.id}>{period.label}</option>
                ))}
              </select>
              <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Spent Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 
                            flex items-center justify-center">
                  <FiArrowUp className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${stats.totalSpent.toFixed(2)}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full">
                <FiTrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500">+{stats.percentageChange}%</span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </motion.div>

          {/* Total Received Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 
                            flex items-center justify-center">
                  <FiArrowDown className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Received</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${stats.totalReceived.toFixed(2)}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full">
                <FiTrendingDown className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">-8.4%</span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </motion.div>
        </div>

        {/* Spending by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Spending by Category
          </h3>
          <div className="space-y-6">
            {stats.categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{category.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${category.amount.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {category.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats; 