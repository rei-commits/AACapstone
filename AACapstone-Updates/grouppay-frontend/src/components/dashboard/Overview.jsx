import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown, FiPlus } from 'react-icons/fi';

const Overview = () => {
  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={activity.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${activity.type === 'paid' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  {activity.type === 'paid' ? (
                    <FiArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <FiArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
                </div>
              </div>
              <p className={`font-semibold ${
                activity.type === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {activity.type === 'paid' ? '+' : '-'}${activity.amount}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md
                       transition-shadow duration-200 text-center"
            >
              <div className="mx-auto w-12 h-12 flex items-center justify-center 
                            bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-3">
                {action.icon}
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

const recentActivity = [
  { id: 1, type: 'owed', description: 'Dinner at Pizza Place', amount: '32.50', date: 'Today' },
  { id: 2, type: 'paid', description: 'Movie Night', amount: '15.00', date: 'Yesterday' },
  // Add more activities...
];

const quickActions = [
  { label: 'Add Expense', icon: <FiPlus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> },
  // Add more actions...
];

export default Overview; 