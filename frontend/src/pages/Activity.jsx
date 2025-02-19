import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowUp, FiArrowDown, FiFilter, FiSearch, FiCalendar, FiDollarSign, FiUsers, FiChevronDown } from 'react-icons/fi';
import { RiRestaurantLine } from 'react-icons/ri';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Stats from '../components/Stats';
import { auth } from '../config/firebase';
import api from '../services/api';

export default function Activity() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [view, setView] = useState('transactions');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [activities, setActivities] = useState([]);

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

  const getFilteredActivities = () => {
    return [...activities, ...transactions].filter(activity => {
      // First apply the category/status filter
      if (filter !== 'all') {
        if (filter === 'food' && activity.category !== 'Food & Drinks') return false;
        if (filter === 'entertainment' && activity.category !== 'Entertainment') return false;
        if (filter === 'pending' && activity.status !== 'pending') return false;
        if (filter === 'completed' && activity.status !== 'completed') return false;
      }

      // Then apply the search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          activity.title.toLowerCase().includes(query) ||
          activity.participants?.join(' ').toLowerCase().includes(query)
        );
      }

      return true;
    });
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          console.log('No user logged in');
          return;
        }

        console.log('Fetching bills for user:', uid);
        const response = await api.get(`/api/bills?uid=${uid}`);
        console.log('Received bills:', response.data);
        
        const bills = response.data;
        
        // Transform bills into activity items
        const activityItems = bills.map(bill => ({
          id: bill.id,
          type: 'bill',
          title: bill.name,
          participants: bill.participants,
          amount: bill.participants.reduce((sum, p) => sum + p.amount, 0),
          createdAt: new Date(bill.createdAt),
          status: 'pending'
        }));

        console.log('Transformed activities:', activityItems);
        
        // Sort by creation date, newest first
        activityItems.sort((a, b) => b.createdAt - a.createdAt);
        setActivities(activityItems);
      } catch (error) {
        console.error('Error fetching activities:', error.response?.data || error);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const filtered = getFilteredActivities();
    setNoResults(filtered.length === 0);
  }, [searchQuery, filter, activities]);

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
            {getFilteredActivities().map(activity => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-500 p-3 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{activity.title}</h3>
                    {activity.participants && (
                      <p className="text-gray-400 text-sm">
                        with {activity.participants.map(p => p.userUid).join(', ')}
                      </p>
                    )}
                    <p className="text-gray-400 text-sm">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${activity.amount.toFixed(2)}</p>
                  <span className={`text-sm ${
                    activity.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {activity.status}
                  </span>
                </div>
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