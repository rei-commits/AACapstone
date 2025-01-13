import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiSearch, FiDollarSign, FiMessageSquare, FiShare2, FiUsers, FiClock, FiCalendar } from 'react-icons/fi';

const Request = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [amount, setAmount] = useState('');
  const [splitEqually, setSplitEqually] = useState(true);
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick amount options
  const quickAmounts = [5, 10, 25, 50];

  // Mock contacts data
  const contacts = [
    { id: 1, name: 'Charly', avatar: 'CA', recentRequest: 'Dinner at Burger Queen' },
    { id: 2, name: 'Tiana', avatar: 'TM', recentRequest: 'Movie night' },
    { id: 3, name: 'Jonel', avatar: 'JR', recentRequest: 'Group lunch' }
  ];

  const handleContactToggle = (contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.some(c => c.id === contact.id);
      if (isSelected) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleRequest = () => {
    // Here we would handle the actual request logic
    console.log('Request:', {
      contacts: selectedContacts,
      amount,
      splitEqually,
      dueDate,
      note,
      amountPerPerson: splitEqually ? (parseFloat(amount) / selectedContacts.length).toFixed(2) : amount
    });
    onClose();
  };

  const handleShare = () => {
    const requestLink = `https://grouppay.app/request/${Math.random().toString(36).substr(2, 9)}`;
    if (navigator.share) {
      navigator.share({
        title: 'GroupPay Request',
        text: `Please pay my request on GroupPay`,
        url: requestLink
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">Request Money</h1>
          </div>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiShare2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Search Bar */}
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 
                  dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Selected Contacts */}
            {selectedContacts.length > 0 && (
              <div className="mb-4 flex gap-2 flex-wrap">
                {selectedContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 
                      text-indigo-600 dark:text-indigo-400 flex items-center gap-2"
                  >
                    <span>{contact.name}</span>
                    <button
                      onClick={() => handleContactToggle(contact)}
                      className="hover:text-indigo-800 dark:hover:text-indigo-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Contacts List */}
            <div className="space-y-2">
              {contacts
                .filter(contact => 
                  !searchQuery || 
                  contact.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((contact) => (
                  <motion.button
                    key={contact.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleContactToggle(contact)}
                    className={`w-full p-3 rounded-xl shadow-sm hover:shadow-md 
                      transition-all flex items-center gap-3 ${
                        selectedContacts.some(c => c.id === contact.id)
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-500'
                          : 'bg-white dark:bg-gray-800'
                      }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 
                      flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium">
                      {contact.avatar}
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium">{contact.name}</h4>
                      {contact.recentRequest && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Last request: {contact.recentRequest}
                        </p>
                      )}
                    </div>
                  </motion.button>
                ))}
            </div>

            {/* Next Button */}
            <div className="mt-6">
              <button
                onClick={() => setStep(2)}
                disabled={selectedContacts.length === 0}
                className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white 
                  hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next ({selectedContacts.length} selected)
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Quick Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Quick Amount</label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className={`p-2 rounded-xl border text-center transition-colors ${
                      amount === quickAmount.toString()
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                  >
                    ${quickAmount}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount and Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Amount</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 
                      dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>

              {selectedContacts.length > 1 && (
                <div className="mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={splitEqually}
                      onChange={(e) => setSplitEqually(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span className="text-sm">Split equally</span>
                  </label>
                  {splitEqually && amount && (
                    <p className="mt-1 text-sm text-gray-500">
                      ${(parseFloat(amount) / selectedContacts.length).toFixed(2)} per person
                    </p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 
                      dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Add a note</label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What's this request for?"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 
                      dark:border-gray-700 dark:bg-gray-800 min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 mb-4">
              <h3 className="font-medium mb-2">Request Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-medium">${amount || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recipients</span>
                  <span className="font-medium">{selectedContacts.length}</span>
                </div>
                {splitEqually && amount && selectedContacts.length > 1 && (
                  <div className="flex justify-between text-indigo-600 dark:text-indigo-400">
                    <span>Amount per person</span>
                    <span className="font-medium">
                      ${(parseFloat(amount) / selectedContacts.length).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 
                  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleRequest}
                disabled={!amount}
                className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white 
                  hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Request
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Request; 