import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowUp, FiArrowDown, FiFilter, FiSearch, FiCalendar, FiDollarSign, FiUsers, FiChevronDown } from 'react-icons/fi';
import { RiRestaurantLine } from 'react-icons/ri';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Stats from '../components/Stats';

export default function Activity() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [view, setView] = useState('transactions');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);

  // Use the same transactions from Dashboard's recentActivity
  const transactions = [
    {
      id: 1,
      type: 'restaurant',
      title: 'Dinner at Olive Garden',
      amount: 120.50,
      date: '2024-02-11',
      status: 'pending',
      participants: ['John', 'Sarah', 'Mike'],
      yourShare: 40.17,
      category: 'Food & Drinks'
    },
    {
      id: 2,
      type: 'group_invite',
      title: 'Movie Night',
      inviter: 'Sarah Wilson',
      date: '2024-02-11',
      status: 'pending',
      action: 'join'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      amount: 45.80,
      from: 'Emma',
      date: 'Yesterday',
      status: 'completed'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'restaurant':
        return <RiRestaurantLine className="w-6 h-6" />;
      case 'group_invite':
        return <FiUsers className="w-6 h-6" />;
      case 'payment':
        return <FiDollarSign className="w-6 h-6" />;
      default:
        return <FiClock className="w-6 h-6" />;
    }
  };

  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      // First apply the category/status filter
      if (filter !== 'all') {
        if (filter === 'food' && transaction.category !== 'Food & Drinks') return false;
        if (filter === 'entertainment' && transaction.category !== 'Entertainment') return false;
        if (filter === 'pending' && transaction.status !== 'pending') return false;
        if (filter === 'completed' && transaction.status !== 'completed') return false;
      }

      // Then apply the search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          transaction.title.toLowerCase().includes(query) ||
          transaction.participants?.join(' ').toLowerCase().includes(query) ||
          transaction.inviter?.toLowerCase().includes(query) ||
          transaction.from?.toLowerCase().includes(query) ||
          transaction.category?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  };

  useEffect(() => {
    const filtered = getFilteredTransactions();
    setNoResults(filtered.length === 0);
  }, [searchQuery, filter]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0A0C1E]' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 backdrop-blur-lg 
        ${darkMode ? 'bg-[#0A0C1E]/80 border-white/5' : 'bg-white/80 border-gray-200'} 
        border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className={`p-2 rounded-lg transition-colors
                  ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <FiArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
              </button>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Activity
              </h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setView('transactions')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  view === 'transactions'
                    ? 'bg-purple-500 text-white'
                    : darkMode 
                      ? 'bg-[#1A1C2E] text-gray-400 hover:bg-[#242642]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setView('stats')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  view === 'stats'
                    ? 'bg-purple-500 text-white'
                    : darkMode 
                      ? 'bg-[#1A1C2E] text-gray-400 hover:bg-[#242642]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Stats
              </button>
            </div>
          </div>
        </div>
      </header>

      {view === 'transactions' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border 
                  ${darkMode 
                    ? 'border-white/10 bg-[#1A1C2E] text-white' 
                    : 'border-gray-200 bg-white text-gray-900'} 
                  placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50`}
              />
            </div>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`appearance-none pl-4 pr-10 py-2 rounded-xl border
                  ${darkMode 
                    ? 'border-white/10 bg-[#1A1C2E] text-white' 
                    : 'border-gray-200 bg-white text-gray-900'}
                  focus:ring-2 focus:ring-purple-500/50`}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="food">Food & Drinks</option>
                <option value="entertainment">Entertainment</option>
              </select>
              <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {getFilteredTransactions().map(transaction => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`rounded-xl overflow-hidden transition-all
                  ${darkMode 
                    ? 'bg-[#1A1C2E] hover:bg-[#242642]' 
                    : 'bg-white hover:bg-gray-50'}
                  hover:shadow-lg hover:shadow-purple-500/10`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      transaction.type === 'restaurant' 
                        ? 'bg-purple-500/10 text-purple-400'
                        : transaction.type === 'group_invite'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-green-500/10 text-green-400'
                    }`}>
                      {getActivityIcon(transaction.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-white text-lg">
                            {transaction.title}
                          </h3>
                          {transaction.participants && (
                            <p className="text-sm text-gray-400 mt-1">
                              with {transaction.participants.join(', ')}
                            </p>
                          )}
                          {transaction.inviter && (
                            <p className="text-sm text-gray-400 mt-1">
                              from {transaction.inviter}
                            </p>
                          )}
                          {transaction.from && (
                            <p className="text-sm text-gray-400 mt-1">
                              from {transaction.from}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              transaction.status === 'pending'
                                ? 'bg-yellow-500/10 text-yellow-400'
                                : 'bg-green-500/10 text-green-400'
                            }`}>
                              {transaction.status}
                            </span>
                            {transaction.category && (
                              <span className="text-xs px-2 py-1 rounded-full 
                                             bg-purple-500/10 text-purple-400">
                                {transaction.category}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              {transaction.date}
                            </span>
                          </div>
                        </div>
                        {transaction.amount && (
                          <div className="text-right">
                            <p className="font-medium text-white text-lg">
                              ${transaction.amount.toFixed(2)}
                            </p>
                            {transaction.yourShare && (
                              <p className="text-sm text-gray-400 mt-1">
                                Your share: ${transaction.yourShare.toFixed(2)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {transaction.type === 'group_invite' && (
                  <div className="px-4 py-3 bg-[#242642] border-t border-white/5">
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 
                                     text-white text-sm rounded-lg transition-colors">
                        Join Group
                      </button>
                      <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 
                                     text-white text-sm rounded-lg transition-colors">
                        Decline
                      </button>
                    </div>
                  </div>
                )}

                {transaction.type === 'restaurant' && (
                  <div className="px-4 py-3 bg-[#242642] border-t border-white/5">
                    <button className="w-full flex items-center justify-center gap-2 
                                   text-sm text-gray-400 hover:text-white transition-colors">
                      <span>View Details</span>
                      <FiChevronDown />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
            
            {/* No Results Message */}
            {noResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FiSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No transactions found</h3>
                  <p className="text-sm mt-2">
                    {searchQuery 
                      ? `No results for "${searchQuery}"`
                      : 'No transactions match the selected filter'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                  }}
                  className="text-purple-500 hover:text-purple-600 text-sm"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <Stats />
      )}
    </div>
  );
} 