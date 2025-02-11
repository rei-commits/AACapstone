import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiSearch, FiDollarSign, FiMessageSquare, FiCamera, FiShare2, FiStar, FiClock } from 'react-icons/fi';

const Transfer = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Quick amount options
  const quickAmounts = [10, 20, 50, 100];

  // Mock recent and frequent contacts data
  const frequentContacts = [
    { id: 1, name: 'Charly', avatar: 'CA', lastTransfer: '2 days ago', frequency: '12 transfers' },
    { id: 2, name: 'Tiana', avatar: 'TM', lastTransfer: '5 days ago', frequency: '8 transfers' },
  ];

  const recentContacts = [
    { id: 3, name: 'Jonel', avatar: 'JR', lastTransfer: '1 week ago', frequency: '3 transfers' },
  ];

  const handleTransfer = () => {
    // Show confirmation step instead of closing immediately
    setShowConfirmation(true);
  };

  const handleConfirmTransfer = () => {
    // Here we would handle the actual transfer logic
    console.log('Transfer:', {
      recipient,
      amount,
      note
    });
    onClose();
  };

  const handleShare = () => {
    // Generate and share payment link
    const paymentLink = `https://grouppay.app/pay/${Math.random().toString(36).substr(2, 9)}`;
    if (navigator.share) {
      navigator.share({
        title: 'GroupPay Transfer',
        text: `Transfer money to me using GroupPay`,
        url: paymentLink
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
            <h1 className="text-xl font-semibold">Transfer Money</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowQRScanner(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiCamera className="w-6 h-6" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiShare2 className="w-6 h-6" />
            </button>
          </div>
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
            <div className="relative mb-6">
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

            {/* Frequent Recipients */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FiStar className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Frequent Recipients
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {frequentContacts.map((contact) => (
                  <motion.button
                    key={contact.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setRecipient(contact);
                      setStep(2);
                    }}
                    className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm 
                      hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 
                        flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium">
                        {contact.avatar}
                      </div>
                      <div>
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {contact.frequency}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent Contacts */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FiClock className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Recent Contacts
                </h3>
              </div>
              <div className="space-y-2">
                {recentContacts.map((contact) => (
                  <motion.button
                    key={contact.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setRecipient(contact);
                      setStep(2);
                    }}
                    className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm 
                      hover:shadow-md transition-all flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 
                      flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium">
                      {contact.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{contact.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last transfer: {contact.lastTransfer}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
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

            {/* Amount and Note */}
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

              <div>
                <label className="block text-sm font-medium mb-2">Add a note</label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What's this for?"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 
                      dark:border-gray-700 dark:bg-gray-800 min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            {/* Transfer Button */}
            <button
              onClick={handleTransfer}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full py-3 px-4 rounded-xl bg-indigo-500 text-white font-medium
                hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Transfer ${parseFloat(amount || 0).toFixed(2)}
            </button>
          </motion.div>
        )}

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full"
              >
                <h3 className="text-lg font-semibold mb-4">Confirm Transfer</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to transfer ${parseFloat(amount).toFixed(2)} to {recipient?.name}?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 py-2 px-4 rounded-xl border border-gray-200 
                      dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmTransfer}
                    className="flex-1 py-2 px-4 rounded-xl bg-indigo-500 text-white 
                      hover:bg-indigo-600"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Transfer; 