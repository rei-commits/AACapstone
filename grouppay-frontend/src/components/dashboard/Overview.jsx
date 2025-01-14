import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown, FiPlus, FiUsers, FiDollarSign } from 'react-icons/fi';
import { groupApi, billApi } from '../../services/api';

const Overview = () => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      const [userBills, userGroups] = await Promise.all([
        billApi.getUserBills(user.id),
        groupApi.getUserGroups(user.id)
      ]);

      // Transform bills into activity items
      const activity = userBills.map(bill => ({
        id: bill.id,
        type: bill.paidBy === user.id ? 'paid' : 'owed',
        description: bill.description,
        amount: bill.amount.toFixed(2),
        date: new Date(bill.createdAt).toLocaleDateString()
      }));

      setRecentActivity(activity);
    } catch (err) {
      setError('Failed to load recent activity');
      console.error('Overview error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { 
      label: 'Add Expense', 
      icon: <FiPlus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      onClick: () => window.location.href = '/create-bill'
    },
    { 
      label: 'New Group', 
      icon: <FiUsers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      onClick: () => window.location.href = '/create-group'
    },
    { 
      label: 'Split Bill', 
      icon: <FiDollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      onClick: () => window.location.href = '/create-bill'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No recent activity
            </div>
          ) : (
            recentActivity.map((activity, index) => (
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
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
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

export default Overview; 