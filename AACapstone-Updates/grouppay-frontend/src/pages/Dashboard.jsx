import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiBell, FiSend, FiUsers, FiClock, FiMoreHorizontal, FiHome, FiCamera, FiPieChart, FiUser, FiStar, FiTrendingUp, FiLogOut, FiArrowDown, FiX } from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle';
import LoadingState from '../components/LoadingState';
import SwipeableHistoryItem from '../components/SwipeableHistoryItem';
import NotificationsPanel from '../components/NotificationsPanel';
import PaymentMethodButton from '../components/PaymentMethodButton';
import CreateBillModal from '../components/CreateBillModal';
import Transfer from '../components/Transfer/Transfer';
import Request from '../components/Request/Request';
import Friends from '../components/dashboard/Friends';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard Page Component
 * Main interface after user login
 * Shows balance, quick actions, and transaction history
 */
const Dashboard = () => {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showCreateBill, setShowCreateBill] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const navigate = useNavigate();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Move quickActions inside the component
  const quickActions = [
    { 
      label: 'Transfer',
      icon: <FiSend className="w-6 h-6 text-orange-500" />,
      bgColor: 'bg-orange-50',
      onClick: () => setShowTransfer(true)
    },
    { 
      label: 'Request',
      icon: <FiUsers className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-50',
      onClick: () => setShowRequest(true)
    },
    { 
      label: 'Split Bill',
      icon: <FiClock className="w-6 h-6 text-purple-500" />,
      bgColor: 'bg-purple-50',
      onClick: () => setShowCreateBill(true)
    },
    { 
      label: 'More',
      icon: <FiMoreHorizontal className="w-6 h-6 text-gray-500" />,
      bgColor: 'bg-gray-50',
      onClick: () => console.log('More clicked')
    }
  ];

  const handleSignOut = () => {
    // Add any sign out logic here (clear tokens, etc)
    navigate('/');
  };

  // Filter transactions based on search query
  const filteredTransactions = splitHistory.filter(transaction => 
    transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.amount.includes(searchQuery) ||
    transaction.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Profile and Actions */}
      <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 p-4 shadow-lg" role="banner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm 
                          flex items-center justify-center text-white font-medium
                          border-2 border-white/20 cursor-pointer
                          hover:bg-white/20 transition-colors duration-200">
                RA
              </div>
              
              {/* Sign Out Dropdown */}
              <div className="absolute left-0 mt-2 w-56 py-2 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl 
                           backdrop-blur-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                           transition-all duration-200 z-50 border border-white/20">
                <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Rei
                  </p>
                </div>
                <div className="px-2 py-2">
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300
                             rounded-xl flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50
                             transition-colors duration-200"
                  >
                    <FiUser className="w-4 h-4" />
                    Account & Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 
                             rounded-xl flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10
                             transition-colors duration-200"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p className="text-white/80">Good Morning,</p>
              <h1 className="font-semibold text-white">
                Rei
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="relative">
              <button 
                aria-label="Search"
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full hover:bg-white/10"
              >
                <FiSearch className="w-6 h-6 text-white" aria-hidden="true" />
              </button>
              
              {/* Search Input */}
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl"
                >
                  <div className="p-2">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search transactions..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-lg focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                    </div>
                    
                    {/* Search Results */}
                    {searchQuery && (
                      <div className="mt-2 max-h-60 overflow-y-auto">
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map(transaction => (
                            <motion.div
                              key={transaction.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setShowSearch(false);
                                setSearchQuery('');
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                  {transaction.icon}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{transaction.title}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">${transaction.amount} - {transaction.date}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No transactions found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
            <button 
              onClick={() => setShowNotifications(true)}
              className="p-2 rounded-full hover:bg-white/10 relative"
              aria-label="Notifications"
            >
              <FiBell className="w-6 h-6 text-white" aria-hidden="true" />
              <span 
                className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                aria-label="New notifications available"
              ></span>
            </button>
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <section aria-labelledby="balance-heading" className="p-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 
                      rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 mb-1">Available Balance</p>
              <h2 className="text-3xl font-bold">$165.43</h2>
            </div>
            <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
              <FiTrendingUp className="w-4 h-4 text-green-400" aria-hidden="true" />
              <span className="text-sm text-green-400" aria-label="Balance increased by 2.8 percent">+2.8%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate('/activity')}
              aria-label="View transaction history"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 
                       transition-colors duration-200 flex items-center gap-2"
            >
              <span>View History</span>
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowWithdrawModal(true)}
                aria-label="Withdraw money to bank account"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20
                         transition-colors duration-200 flex items-center gap-2"
              >
                <FiArrowDown className="w-4 h-4" />
                <span>Withdraw</span>
              </button>
              <button 
                onClick={() => setShowTopUpModal(true)}
                aria-label="Add money to balance"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500
                         hover:from-green-500 hover:to-emerald-600 transition-colors duration-200
                         text-white font-medium shadow-lg shadow-green-500/20"
              >
                + Add Money
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <div className="p-4 grid grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.label}
            onClick={action.onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl
                     shadow-lg shadow-gray-200/50 dark:shadow-gray-900/30
                     hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mb-2
                          shadow-lg shadow-${action.bgColor}/20`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Friends Section */}
      <section className="px-4">
        <Friends />
      </section>

      {/* Split Bill History */}
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Recent Splits</h3>
            <button className="text-emerald-500 dark:text-emerald-400 text-sm hover:text-emerald-600 
                           dark:hover:text-emerald-300 font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {splitHistory.map((transaction) => (
              <motion.div
                key={transaction.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedTransaction(transaction)}
                className="p-4 rounded-xl bg-white dark:bg-gray-800 
                         shadow-lg shadow-gray-200/50 dark:shadow-gray-900/30
                         hover:shadow-xl dark:hover:bg-gray-800/90 
                         transition-all duration-200
                         cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100/80 dark:bg-gray-700/50 
                                flex items-center justify-center text-2xl shadow-inner">
                      {transaction.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-100">{transaction.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{transaction.date}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {transaction.participants.map((participant) => (
                          <div
                            key={participant.initials}
                            className={`w-6 h-6 rounded-lg bg-${participant.color}-50 dark:bg-${participant.color}-900/20 
                                      flex items-center justify-center text-xs font-medium 
                                      text-${participant.color}-600 dark:text-${participant.color}-400
                                      ring-1 ring-${participant.color}-200 dark:ring-${participant.color}-800/30
                                      shadow-sm`}
                          >
                            {participant.initials}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">${transaction.amount} USD</p>
                    <p className={`text-sm mt-0.5 ${
                      transaction.status.includes('100%') 
                        ? 'text-emerald-500 dark:text-emerald-400' 
                        : 'text-amber-500 dark:text-amber-400'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 border-t dark:border-gray-700/50 backdrop-blur-lg">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-evenly items-center px-8 py-2">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-2 px-6 rounded-xl transition-all duration-200
                  ${item.active 
                    ? 'text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`${item.active ? 'scale-110' : ''} transition-transform duration-200`}>
                  {item.icon}
                </div>
                <span className={`text-xs mt-1 ${item.active ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
                {item.active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 w-12 h-1 bg-indigo-500 dark:bg-indigo-400 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Modals */}
      <AnimatePresence>
        {showCreateBill && (
          <div className="fixed inset-0 z-50 bg-black/50">
            <div className="min-h-screen overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4">
                <div className="w-full max-w-md">
                  <CreateBillModal 
                    isOpen={showCreateBill} 
                    onClose={() => setShowCreateBill(false)} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {showTransfer && (
          <div className="fixed inset-0 z-50 bg-black/50">
            <div className="min-h-screen overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4">
                <div className="w-full max-w-lg">
                  <Transfer onClose={() => setShowTransfer(false)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {showRequest && (
          <div className="fixed inset-0 z-50 bg-black/50">
            <div className="min-h-screen overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4">
                <div className="w-full max-w-lg">
                  <Request onClose={() => setShowRequest(false)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 bg-black/50">
            <div className="min-h-screen overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Withdraw Money</h2>
                    <button
                      onClick={() => setShowWithdrawModal(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount to Withdraw</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                                   bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Available Balance: $165.43</p>
                    </div>

                    {/* Withdrawal Method */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Withdrawal Method</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20">
                          <div className="text-center">
                            <p className="font-medium text-indigo-600 dark:text-indigo-400">Instant</p>
                            <p className="text-xs text-gray-500 mt-1">1.5% fee</p>
                            <p className="text-xs text-gray-500">~30 seconds</p>
                          </div>
                        </button>
                        <button className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                          <div className="text-center">
                            <p className="font-medium">Standard</p>
                            <p className="text-xs text-gray-500 mt-1">No fee</p>
                            <p className="text-xs text-gray-500">1-3 business days</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Bank Account Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Select Bank Account</label>
                      <select className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                                     bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500">
                        <option value="chase">Chase - ****4567</option>
                        <option value="add">+ Add New Account</option>
                      </select>
                    </div>

                    {/* Withdraw Button */}
                    <button className="w-full py-3 rounded-xl bg-indigo-500 text-white font-medium
                                   hover:bg-indigo-600 transition-colors">
                      Withdraw Money
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setSelectedTransaction(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] max-w-md mx-auto bg-gray-900 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-2xl">
                  {selectedTransaction.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white">{selectedTransaction.title}</h2>
                  <p className="text-sm text-gray-400">{selectedTransaction.date}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm">
                  {selectedTransaction.status}
                </div>
              </div>

              {/* Total Amount */}
              <div className="px-4 py-3">
                <p className="text-sm text-gray-400">Total Amount</p>
                <p className="text-2xl font-bold text-white">${selectedTransaction.amount} USD</p>
              </div>

              {/* Participants */}
              <div className="px-4 py-3">
                <h3 className="text-lg font-medium text-white mb-3">Participants</h3>
                <div className="space-y-3">
                  {selectedTransaction.participants.map((participant) => (
                    <div
                      key={participant.initials}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-${participant.color}-900/30 
                                    flex items-center justify-center font-medium text-${participant.color}-400`}>
                          {participant.initials}
                        </div>
                        <div>
                          <p className="font-medium text-white">{participant.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-400">{participant.role}</p>
                            <div className={`w-2 h-2 rounded-full ${participant.hasPaid ? 'bg-green-500' : 'bg-gray-500'}`} />
                            <span className={`text-sm ${participant.hasPaid ? 'text-green-500' : 'text-gray-400'}`}>
                              {participant.hasPaid ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-white">${(selectedTransaction.amount * participant.share).toFixed(2)}</p>
                        {!participant.hasPaid && !participant.isCurrentUser && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle reminder
                              console.log(`Sending reminder to ${participant.name}`);
                            }}
                            className="p-2 text-amber-400 hover:bg-amber-500/20 rounded-xl transition-colors"
                          >
                            <FiBell className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <div className="p-4 border-t border-gray-800">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="w-full py-3 text-gray-400 hover:bg-gray-800 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Split history data
const splitHistory = [
  {
    id: 1,
    title: 'Burger Queen',
    icon: '🍔',
    amount: '42.80',
    status: '80% Paid',
    date: 'Oct 10, 2023 - 14:49',
    participants: [
      { 
        initials: 'RA', 
        name: 'Rei', 
        role: 'Host', 
        color: 'indigo', 
        share: 0.4,
        isCurrentUser: true,
        hasPaid: true 
      },
      { 
        initials: 'JR', 
        name: 'Jonel Rodriguez', 
        role: 'Member', 
        color: 'pink', 
        share: 0.3,
        hasPaid: true 
      },
      { 
        initials: 'CA', 
        name: 'Charly Acevedo', 
        role: 'Member', 
        color: 'violet', 
        share: 0.3,
        hasPaid: false 
      }
    ]
  },
  {
    id: 2,
    title: 'Blank Coffee',
    icon: '☕',
    amount: '15.20',
    status: '100% Paid',
    date: 'Oct 8, 2023 - 19:49',
    participants: [
      { 
        initials: 'RA', 
        name: 'Rei', 
        role: 'Host', 
        color: 'indigo', 
        share: 0.5,
        isCurrentUser: true,
        hasPaid: true 
      },
      { 
        initials: 'TM', 
        name: 'Tiana Martinez', 
        role: 'Member', 
        color: 'pink', 
        share: 0.5,
        hasPaid: true 
      }
    ]
  }
];

// Navigation items
const navItems = [
  { 
    label: 'Home', 
    icon: <FiHome className="w-6 h-6" />, 
    active: true,
    path: '/dashboard'
  },
  { 
    label: 'Activity', 
    icon: <FiClock className="w-6 h-6" />,
    active: false,
    path: '/activity'
  },
  { 
    label: 'Stats', 
    icon: <FiPieChart className="w-6 h-6" />,
    active: false,
    path: '/stats'
  }
];

export default Dashboard; 