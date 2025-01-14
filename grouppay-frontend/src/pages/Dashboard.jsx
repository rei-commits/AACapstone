import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiBell, FiSend, FiUsers, FiClock, FiMoreHorizontal, FiHome, FiCamera, FiPieChart, FiUser, FiStar, FiTrendingUp, FiLogOut, FiArrowDown, FiX, FiDollarSign } from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle';
import LoadingState from '../components/LoadingState';
import SwipeableHistoryItem from '../components/SwipeableHistoryItem';
import NotificationsPanel from '../components/NotificationsPanel';
import PaymentMethodButton from '../components/PaymentMethodButton';
import CreateBillModal from '../components/CreateBillModal';
import Transfer from '../components/Transfer/Transfer';
import Request from '../components/Request/Request';
import Friends from '../components/dashboard/Friends';
import Overview from '../components/dashboard/Overview';
import { useNavigate } from 'react-router-dom';
import { userApi, billApi } from '../services/api';

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
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchUserData(parsedUser.id);
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      setIsLoading(true);
      const [userBills, userDetails] = await Promise.all([
        billApi.getUserBills(userId),
        userApi.getUser(userId)
      ]);

      // Update user state with latest data
      setUser(prevUser => ({
        ...prevUser,
        ...userDetails
      }));

      // Transform bills into transactions
      const transformedTransactions = userBills.map(bill => ({
        id: bill.id,
        title: bill.title || 'Untitled Bill',
        amount: (bill.total || 0).toFixed(2),
        date: new Date(bill.createdAt).toLocaleDateString(),
        icon: <FiDollarSign className="text-gray-600 dark:text-gray-400" />
      }));

      setTransactions(transformedTransactions);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      // Show error in UI
      // You might want to add an error state and display it in the UI
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction => 
    transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.amount.includes(searchQuery) ||
    transaction.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              
              {/* Sign Out Dropdown */}
              <div className="absolute left-0 mt-2 w-56 py-2 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl 
                           backdrop-blur-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                           transition-all duration-200 z-50 border border-white/20">
                <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.fullName || 'User'}
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
                {user?.fullName || 'User'}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Overview Section */}
            <Overview />

            {/* Friends Section */}
            <Friends />
          </>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        )}
        {showCreateBill && (
          <CreateBillModal onClose={() => setShowCreateBill(false)} />
        )}
        {showTransfer && (
          <Transfer onClose={() => setShowTransfer(false)} />
        )}
        {showRequest && (
          <Request onClose={() => setShowRequest(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard; 