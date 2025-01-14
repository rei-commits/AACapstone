import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiArrowLeft, FiUsers, FiDollarSign } from 'react-icons/fi';
import { groupApi, billApi } from '../services/api';

const GroupDetailsPage = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
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
    fetchGroupData();
  }, [groupId, navigate]);

  const fetchGroupData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [groupResponse, billsResponse] = await Promise.all([
        groupApi.getGroup(groupId),
        billApi.getGroupBills(groupId)
      ]);
      
      if (groupResponse.id) {
        setGroup(groupResponse);
        setBills(billsResponse);
      } else {
        setError('Group not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load group data');
      console.error('Group details error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalSpent = () => {
    return bills.reduce((total, bill) => total + bill.amount, 0);
  };

  const calculateMemberBalance = (memberId) => {
    let balance = 0;
    bills.forEach(bill => {
      // If member is the payer
      if (bill.paidBy === memberId) {
        balance += bill.amount;
      }
      // Subtract member's share
      const share = bill.amount / bill.splitBetween.length;
      if (bill.splitBetween.includes(memberId)) {
        balance -= share;
      }
    });
    return balance;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.button
                whileHover={{ x: -5 }}
                onClick={() => navigate('/dashboard')}
                className="mr-4 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <FiArrowLeft size={24} />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {group?.name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {group?.description}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/create-bill?groupId=${groupId}`)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg
                       hover:bg-green-600 transition-colors duration-200"
            >
              <FiPlus />
              Add Bill
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Members Section */}
          <section className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FiUsers />
                  Members
                </h2>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {group?.members.length} people
                </span>
              </div>
              
              <div className="space-y-4">
                {group?.members.map(member => {
                  const balance = calculateMemberBalance(member.id);
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 
                                    flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          {member.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{member.fullName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className={`text-right ${balance > 0 ? 'text-green-500' : balance < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        {balance > 0 ? '+' : ''}{balance.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Bills Section */}
          <section className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FiDollarSign />
                  Bills
                </h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Spent</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${calculateTotalSpent().toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {bills.length === 0 ? (
                  <div className="text-center py-8">
                    <FiDollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      No bills yet. Add one to start splitting expenses!
                    </p>
                  </div>
                ) : (
                  bills.map(bill => {
                    const payer = group.members.find(m => m.id === bill.paidBy);
                    return (
                      <motion.div
                        key={bill.id}
                        whileHover={{ scale: 1.01 }}
                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                        onClick={() => navigate(`/bills/${bill.id}`)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {bill.description}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Paid by {payer?.fullName} • {new Date(bill.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Split between {bill.splitBetween.length} people
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-green-500">
                            ${bill.amount.toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default GroupDetailsPage; 