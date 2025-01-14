import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiUsers, FiClock, FiDollarSign, FiCamera, FiFilter, FiChevronRight } from 'react-icons/fi';
import CreateBillModal from '../components/CreateBillModal';

const Split = () => {
  const [showCreateBill, setShowCreateBill] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for active splits
  const activeSplits = [
    {
      id: 1,
      title: 'Weekend Trip',
      totalAmount: 450.80,
      members: ['You', 'Sarah', 'Mike', 'John'],
      dueDate: '2024-01-25',
      status: 'pending',
      yourShare: 112.70,
      paid: 50.00
    },
    {
      id: 2,
      title: 'Dinner at Burger Queen',
      totalAmount: 42.80,
      members: ['You', 'Emma', 'Mike'],
      dueDate: '2024-01-20',
      status: 'pending',
      yourShare: 14.27,
      paid: 0
    }
  ];

  // Mock data for groups
  const groups = [
    {
      id: 1,
      name: 'Weekend Squad',
      members: ['You', 'Sarah', 'Mike', 'John'],
      recentActivity: 'Weekend Trip - $450.80',
      icon: '🎉'
    },
    {
      id: 2,
      name: 'Roommates',
      members: ['You', 'Emma', 'Mike'],
      recentActivity: 'Utilities - $120.50',
      icon: '🏠'
    }
  ];

  // Quick actions for splitting bills
  const quickActions = [
    {
      label: 'Split Bill',
      icon: <FiDollarSign className="w-6 h-6" />,
      onClick: () => setShowCreateBill(true),
      color: 'bg-indigo-500'
    },
    {
      label: 'Scan Receipt',
      icon: <FiCamera className="w-6 h-6" />,
      onClick: () => console.log('Scan receipt'),
      color: 'bg-green-500'
    },
    {
      label: 'New Group',
      icon: <FiUsers className="w-6 h-6" />,
      onClick: () => console.log('Create group'),
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Split Bills</h1>
          <button
            onClick={() => setShowCreateBill(true)}
            className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
          >
            <FiPlus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className={`${action.color} text-white p-4 rounded-xl flex flex-col 
                items-center gap-2 shadow-lg`}
            >
              {action.icon}
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Active Splits */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Active Splits</h2>
            <button className="flex items-center gap-1 text-sm text-indigo-500">
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
          </div>
          <div className="space-y-4">
            {activeSplits.map((split) => (
              <motion.div
                key={split.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{split.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Due {new Date(split.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${split.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your share: ${split.yourShare.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {split.members.slice(0, 3).map((member, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 
                          flex items-center justify-center text-indigo-600 dark:text-indigo-400 
                          text-sm font-medium border-2 border-white dark:border-gray-800"
                      >
                        {member[0]}
                      </div>
                    ))}
                    {split.members.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 
                        flex items-center justify-center text-gray-600 dark:text-gray-400 
                        text-sm font-medium border-2 border-white dark:border-gray-800"
                      >
                        +{split.members.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${(split.paid / split.yourShare) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {((split.paid / split.yourShare) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Groups */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Groups</h2>
          <div className="space-y-4">
            {groups.map((group) => (
              <motion.button
                key={group.id}
                whileHover={{ scale: 1.01 }}
                className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm 
                  flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 
                  flex items-center justify-center text-2xl">
                  {group.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{group.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {group.members.length} members • {group.recentActivity}
                  </p>
                </div>
                <FiChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Create Bill Modal */}
      <CreateBillModal
        isOpen={showCreateBill}
        onClose={() => setShowCreateBill(false)}
      />
    </div>
  );
};

export default Split; 