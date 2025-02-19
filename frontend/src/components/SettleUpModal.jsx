import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiDollarSign, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import Modal from './Modal';

export default function SettleUpModal({ isOpen, onClose, friends }) {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const paymentMethods = [
    { id: 'card', name: 'Credit Card', icon: <FiCreditCard /> },
    { id: 'bank', name: 'Bank Transfer', icon: <FiDollarSign /> }
  ];

  const handleSettleUp = () => {
    // Handle payment logic here
    toast.success('Payment successful!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[500px] bg-[#1A1C2E] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Settle Up
            </h2>
            <button onClick={onClose}>
              <FiX className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Friend Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400">Select Friend to Pay</h3>
            <div className="grid grid-cols-1 gap-3">
              {friends.filter(f => f.owed > 0).map(friend => (
                <motion.button
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedFriend?.id === friend.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-800 hover:border-purple-500/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 p-[2px]">
                        <div className="w-full h-full rounded-[10px] bg-[#1A1C2E] flex items-center justify-center">
                          <span className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-500 
                            bg-clip-text text-transparent">
                            {friend.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-white">{friend.name}</h4>
                        <p className="text-sm text-green-400">You owe ${friend.owed.toFixed(2)}</p>
                      </div>
                    </div>
                    <FiCheckCircle className={`w-5 h-5 ${
                      selectedFriend?.id === friend.id ? 'text-purple-500' : 'text-gray-700'
                    }`} />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          {selectedFriend && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <h3 className="text-sm font-medium text-gray-400">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map(method => (
                  <motion.button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-800 hover:border-purple-500/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        paymentMethod === method.id ? 'bg-purple-500' : 'bg-gray-800'
                      }`}>
                        {method.icon}
                      </div>
                      <span className="font-medium text-white">{method.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <button
            onClick={handleSettleUp}
            disabled={!selectedFriend}
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              selectedFriend
                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedFriend 
              ? `Pay $${selectedFriend.owed.toFixed(2)} to ${selectedFriend.name.split(' ')[0]}`
              : 'Select a friend to pay'
            }
          </button>
        </div>
      </div>
    </Modal>
  );
} 