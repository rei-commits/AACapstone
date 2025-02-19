import React, { useState } from 'react';
import Modal from './Modal';
import ReceiptUploader from './ReceiptUploader';
import FriendSelector from './FriendSelector';
import ItemSelector from './ItemSelector';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import MoneyRain from './MoneyRain';
import axios from 'axios';

export default function CreateBillModal({ isOpen, onClose, onBillCreated }) {
  const { darkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [billName, setBillName] = useState('');
  const [scannedItems, setScannedItems] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [itemAssignments, setItemAssignments] = useState({});
  const [taxAndTip, setTaxAndTip] = useState({ tax: 0, tip: 0 });
  const [totals, setTotals] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showMoneyRain, setShowMoneyRain] = useState(false);
  const navigate = useNavigate();

  const handleReceiptScan = (result) => {
    console.log('Scanned result:', result);
    
    // Process the items from the receipt and add unique IDs
    const uniqueItems = result.items.reduce((acc, item) => {
      const existingItem = acc.find(i => i.name === item.name && i.price === item.price);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
      } else {
        acc.push({
          ...item,
          id: `item-${acc.length + 1}`, // Add unique ID
          quantity: item.quantity || 1
        });
      }
      return acc;
    }, []);

    // Set scanned items only once
    setScannedItems(uniqueItems);
    
    // Set tax and tip
    setTaxAndTip({
      tax: result.tax || 0,
      tip: 0
    });
    
    // Clear any existing assignments when new receipt is scanned
    setItemAssignments({});
    
    console.log('Processed items:', uniqueItems);
  };

  const handleTipChange = (newTip) => {
    setTaxAndTip(prev => ({
      ...prev,
      tip: newTip
    }));
  };

  const handleItemAssignment = (itemId, friendId, action) => {
    setItemAssignments(prev => {
      const newAssignments = { ...prev };
      
      if (action === 'add') {
        if (!newAssignments[itemId]) {
          newAssignments[itemId] = [];
        }
        if (!newAssignments[itemId].includes(friendId)) {
          newAssignments[itemId] = [...newAssignments[itemId], friendId];
        }
      } else {
        newAssignments[itemId] = (newAssignments[itemId] || [])
          .filter(id => id !== friendId);
        if (newAssignments[itemId].length === 0) {
          delete newAssignments[itemId];
        }
      }
      
      return newAssignments;
    });
  };

  const calculateSummary = (items, tax, tip) => {
    // Group items by user
    const userSummaries = {};
    
    // Calculate subtotal for each user
    items.forEach(item => {
        if (item.assignedTo) {
            item.assignedTo.forEach(user => {
                if (!userSummaries[user.id]) {
                    userSummaries[user.id] = {
                        user: user,
                        items: [],
                        subtotal: 0
                    };
                }
                // Split item cost among assigned users
                const splitCost = item.price / item.assignedTo.length;
                userSummaries[user.id].items.push({
                    name: item.name,
                    amount: splitCost
                });
                userSummaries[user.id].subtotal += splitCost;
            });
        }
    });

    // Split tax and tip equally among all participants
    const participantCount = Object.keys(userSummaries).length;
    const taxPerPerson = tax / participantCount;
    const tipPerPerson = tip / participantCount;

    // Add tax and tip to each person's total
    Object.values(userSummaries).forEach(summary => {
        summary.tax = taxPerPerson;
        summary.tip = tipPerPerson;
        summary.total = summary.subtotal + taxPerPerson + tipPerPerson;
    });

    return userSummaries;
  };

  const calculateTotals = () => {
    // Format items with assignments
    const itemsWithAssignments = scannedItems.map(item => ({
        ...item,
        assignedTo: (itemAssignments[item.id] || []).map(uid => 
            selectedFriends.find(friend => friend.id === uid)
        ).filter(Boolean)
    }));

    // Use the new summary calculation
    const summaries = calculateSummary(itemsWithAssignments, taxAndTip.tax, taxAndTip.tip);
    
    // Convert summaries to totals format
    const newTotals = {};
    Object.entries(summaries).forEach(([uid, summary]) => {
        newTotals[uid] = summary.total;
    });

    setTotals(newTotals);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Map items with their assignments and ensure no duplicates
      const billItems = scannedItems.map(item => ({
        name: item.name,
        price: parseFloat(item.price),
        quantity: 1 // Set quantity to 1 since we're not combining duplicates
      }));

      // Calculate participant totals
      const participantTotals = {
        1: 0, // Your ID
        2: 0  // Tiana's ID
      };

      // Calculate item assignments and totals
      scannedItems.forEach(item => {
        const assignedTo = itemAssignments[item.id] || [];
        if (assignedTo.length > 0) {
          // Split item cost among assigned participants
          const splitAmount = item.price / assignedTo.length;
          assignedTo.forEach(participantId => {
            participantTotals[participantId] += splitAmount;
          });
        }
      });

      // Split tax and tip equally
      const taxPerPerson = parseFloat(taxAndTip.tax) / 2;
      const tipPerPerson = parseFloat(taxAndTip.tip) / 2;

      const billData = {
        name: "Carmine's",
        items: billItems,
        tax: parseFloat(taxAndTip.tax),
        tip: parseFloat(taxAndTip.tip),
        payerId: 1, // You are the payer
        participantIds: [1, 2], // You and Tiana
        splits: [
          {
            userId: 1, // You
            amount: participantTotals[1] + taxPerPerson + tipPerPerson
          },
          {
            userId: 2, // Tiana
            amount: participantTotals[2] + taxPerPerson + tipPerPerson
          }
        ]
      };

      console.log('Sending bill data:', billData);
      const response = await axios.post('http://localhost:8080/api/bills?userId=1', billData);
      
      if (response.data) {
        toast.success('Bill created successfully!');
        setShowMoneyRain(true);
        onBillCreated?.();
        onClose();
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error(error.response?.data?.message || 'Failed to create bill');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Upload Receipt', description: 'Scan or upload your receipt' },
    { number: 2, title: 'Add Friends', description: 'Select who to split with' },
    { number: 3, title: 'Split Items', description: 'Assign items and adjust splits' }
  ];

  const handleFriendSelect = (friend) => {
    console.log('Selected friend:', friend);
    if (!friend || !friend.id) {
      console.error('Invalid friend data:', friend);
      return;
    }
    
    // Check if friend is already selected
    const isAlreadySelected = selectedFriends.some(f => f.id === friend.id);
    if (!isAlreadySelected) {
      setSelectedFriends(prev => [...prev, friend]);
    }
  };

  const handleNext = () => {
    if (step === 1 && scannedItems.length === 0) {
      toast.error('Please add at least one item to the bill');
      return;
    }
    if (step === 2 && selectedFriends.length === 0) {
      toast.error('Please select at least one friend');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  return isOpen ? (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`${
            darkMode ? 'bg-[#1F2037]' : 'bg-white'
          } rounded-2xl shadow-xl w-full max-w-2xl relative flex flex-col max-h-[90vh]`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 z-10 text-white"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Premium Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-white flex-shrink-0">
            <h2 className="text-2xl font-bold">Create New Split</h2>
            <p className="text-white/80">Split bills effortlessly with friends</p>
          </div>

          {/* Step Progress */}
          <div className="flex justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${step === s.number 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}
                `}>
                  {s.number}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-gray-500">{s.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-12 h-px bg-gray-200 dark:bg-gray-700 mx-4 hidden sm:block" />
                )}
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-y-auto flex-grow">
            {step === 1 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bill Name
                  </label>
                  <input
                    type="text"
                    value={billName}
                    onChange={(e) => setBillName(e.target.value)}
                    placeholder="Enter bill name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <ReceiptUploader onScanComplete={handleReceiptScan} />
              </div>
            )}

            {step === 2 && (
              <FriendSelector 
                selected={selectedFriends} 
                onSelect={setSelectedFriends}
              />
            )}

            {step === 3 && (
              <ItemSelector
                items={scannedItems}
                participants={selectedFriends}
                onAssignment={handleItemAssignment}
                taxAndTip={taxAndTip}
                onTipChange={(tip) => setTaxAndTip(prev => ({ ...prev, tip }))}
              />
            )}
          </div>

          {/* Footer - Keep only this button section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button
              onClick={() => step > 1 ? handleBack() : onClose()}
              className="px-6 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 
                         text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {step > 1 ? 'Back' : 'Cancel'}
            </button>

            <button
              onClick={() => step < 3 ? handleNext() : handleSubmit()}
              disabled={
                (step === 1 && (!billName || !scannedItems.length)) ||
                (step === 2 && !selectedFriends.length) ||
                isLoading
              }
              className={`px-6 py-2 rounded-xl font-medium ${
                (!billName || !scannedItems.length || isLoading)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600'
              }`}
            >
              {step < 3 ? 'Continue' : (isLoading ? 'Creating...' : 'Create Bill')}
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Money Rain Animation */}
      <MoneyRain 
        isVisible={showMoneyRain} 
        onComplete={() => setShowMoneyRain(false)}
      />
    </>
  ) : null;
} 