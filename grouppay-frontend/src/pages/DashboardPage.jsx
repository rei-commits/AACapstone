import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiUsers, FiDollarSign, FiLogOut } from 'react-icons/fi';
import { groupApi, billApi } from '../services/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch user's groups and bills
      const userGroups = await groupApi.getUserGroups(user.id);
      const userBills = await billApi.getUserBills(user.id);
      setGroups(userGroups);
      setBills(userBills);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Groups Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Groups
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/create-group')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg
                           hover:bg-indigo-600 transition-colors duration-200"
                >
                  <FiPlus />
                  New Group
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {groups.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                    <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      No groups yet. Create one to get started!
                    </p>
                  </div>
                ) : (
                  groups.map(group => (
                    <motion.div
                      key={group.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow cursor-pointer"
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {group.members.length} members
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </section>

            {/* Bills Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Bills
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/create-bill')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg
                           hover:bg-green-600 transition-colors duration-200"
                >
                  <FiPlus />
                  New Bill
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {bills.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                    <FiDollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      No bills yet. Add one to start splitting expenses!
                    </p>
                  </div>
                ) : (
                  bills.map(bill => (
                    <motion.div
                      key={bill.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow cursor-pointer"
                      onClick={() => navigate(`/bills/${bill.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {bill.description}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(bill.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-green-500">
                          ${bill.amount.toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage; 