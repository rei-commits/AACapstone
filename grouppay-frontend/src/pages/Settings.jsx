import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiTrash2, FiCreditCard, FiEdit2, FiSave } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);

  // Mock user data
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Rei Andreina',
    email: 'rei@example.com',
    phone: '(123) 456-7890'
  });

  // Mock payment methods data
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'bank', name: 'Chase', accountType: 'Checking', lastFour: '4567' },
    { id: 2, type: 'bank', name: 'Bank of America', accountType: 'Savings', lastFour: '8901' },
    { id: 3, type: 'card', name: 'Visa Debit', lastFour: '3456', expiryDate: '05/25' }
  ]);

  const handleRemovePaymentMethod = (methodId) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== methodId));
  };

  const handleSavePersonal = () => {
    setEditingPersonal(false);
    // Here you would typically make an API call to update the user's information
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Account & Settings</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Personal Information Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <button
              onClick={() => setEditingPersonal(!editingPersonal)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 
                       dark:hover:bg-gray-700 transition-colors"
            >
              {editingPersonal ? <FiSave className="w-5 h-5" /> : <FiEdit2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Full Name
              </label>
              {editingPersonal ? (
                <input
                  type="text"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{personalInfo.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Email
              </label>
              {editingPersonal ? (
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{personalInfo.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Phone Number
              </label>
              {editingPersonal ? (
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{personalInfo.phone}</p>
              )}
            </div>
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Payment Methods</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddCardModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium
                         hover:bg-indigo-600 transition-colors flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Card
              </button>
              <button
                onClick={() => setShowAddBankModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium
                         hover:bg-indigo-600 transition-colors flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Link Bank
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 rounded-xl
                         bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30
                               flex items-center justify-center">
                    <FiCreditCard className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {method.type === 'bank' ? (
                        `${method.accountType} •••• ${method.lastFour}`
                      ) : (
                        `•••• ${method.lastFour} | Expires ${method.expiryDate}`
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemovePaymentMethod(method.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                           rounded-xl transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {paymentMethods.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No payment methods added yet
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add Bank Account Modal */}
      {showAddBankModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Link Bank Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bank Name</label>
                <input
                  type="text"
                  placeholder="Enter bank name"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Account Type</label>
                <select className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                                bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500">
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Account Number</label>
                <input
                  type="text"
                  placeholder="Enter account number"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Routing Number</label>
                <input
                  type="text"
                  placeholder="Enter routing number"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddBankModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                         hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle adding bank account
                  setShowAddBankModal(false);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-indigo-500 text-white
                         hover:bg-indigo-600 transition-colors"
              >
                Link Account
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Debit Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Add Debit Card</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="Enter card number"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                             bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="Enter CVV"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                             bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Name on Card</label>
                <input
                  type="text"
                  placeholder="Enter name as shown on card"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddCardModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                         hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle adding debit card
                  setShowAddCardModal(false);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-indigo-500 text-white
                         hover:bg-indigo-600 transition-colors"
              >
                Add Card
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings; 