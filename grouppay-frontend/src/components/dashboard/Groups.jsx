import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiPlus } from 'react-icons/fi';

const Groups = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Groups</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary"
        >
          <FiPlus className="mr-2" />
          New Group
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">{group.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {group.members} members
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total Spent</span>
                <span className="font-medium">${group.totalSpent}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Your Balance</span>
                <span className={`font-medium ${
                  group.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {group.balance >= 0 ? '+' : '-'}${Math.abs(group.balance)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const groups = [
  { id: 1, name: 'Roommates', members: 4, totalSpent: '1,234.56', balance: 123.45 },
  { id: 2, name: 'Trip to Vegas', members: 6, totalSpent: '2,345.67', balance: -234.56 },
  // Add more groups...
];

export default Groups; 