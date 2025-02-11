import React, { useState } from 'react';
import Modal from './Modal';
import ReceiptUploader from './ReceiptUploader';
import FriendSelector from './FriendSelector';
import ItemSelector from './ItemSelector';
import TaxTipCalculator from './TaxTipCalculator';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { auth } from '../config/firebase';
import { FiX } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const API_URL = 'http://localhost:8081';

export default function CreateGroupModal({ isOpen, onClose, onSubmit }) {
  const { darkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [scannedItems, setScannedItems] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [groupName, setGroupName] = useState('');
  
  const handleReceiptUpload = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading file:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    try {
      const response = await fetch(`${API_URL}/api/bills/scan`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Scan result:', data);
      setScanResult(data);
      setUploadedFile(file);
      toast.success('Receipt scanned successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload receipt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setStep(2);
  };

  const handleCreateGroup = async () => {
    try {
      // First create the group
      const groupResponse = await fetch(`${API_URL}/api/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.currentUser.accessToken}`
        },
        body: JSON.stringify({
          name: groupName,
          members: selectedFriends.map(friend => friend.uid)
        })
      });
      
      const groupData = await groupResponse.json();

      // Then create the bill with the scanned items
      const billResponse = await fetch(`${API_URL}/api/bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.currentUser.accessToken}`
        },
        body: JSON.stringify({
          groupId: groupData.id,
          title: groupName,
          items: scannedItems,
          participants: selectedFriends.map(friend => ({
            userId: friend.uid,
            share: (totalAmount / selectedFriends.length).toFixed(2)
          })),
          totalAmount: totalAmount,
          tax: taxAmount,
          tip: tipAmount
        })
      });

      const billData = await billResponse.json();
      toast.success('Group and bill created successfully!');
      setCreateGroupModalOpen(false);
    } catch (error) {
      toast.error('Error creating group and bill');
    }
  };

  const steps = [
    { number: 1, title: 'Upload Receipt', description: 'Scan or upload your receipt' },
    { number: 2, title: 'Add Friends', description: 'Select who to split with' },
    { number: 3, title: 'Split Items', description: 'Assign items and adjust splits' }
  ];

  return isOpen ? (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${
          darkMode ? 'bg-[#1F2037]' : 'bg-white'
        } rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 z-10 text-white"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Premium Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-white">
          <h2 className="text-2xl font-bold">Create New Split</h2>
          <p className="text-white/80">Split bills effortlessly with friends</p>
        </div>

        {/* Step Progress */}
        <div className="flex justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
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
        <div className="p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          {step === 1 && (
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
              
              <ReceiptUploader 
                onUpload={handleReceiptUpload}
                hasUploadedFile={!!uploadedFile && !isLoading}
                scanResult={scanResult}
              />

              {isLoading && (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-2" />
                  Scanning receipt...
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Participants</h2>
              <FriendSelector 
                onSelect={setSelectedFriends} 
                selected={selectedFriends}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Items</h2>
              <ItemSelector 
                items={scannedItems}
                participants={selectedFriends}
                onItemAssignment={handleItemAssignment}
              />
              <TaxTipCalculator 
                subtotal={calculateSubtotal()}
                onUpdate={handleTaxTipUpdate}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? (!groupName || !uploadedFile) : (step === 2 ? selectedFriends.length === 0 : false)}
              className={`px-6 py-2 rounded-xl font-medium ${
                (step === 1 && (!groupName || !uploadedFile)) || (step === 2 && selectedFriends.length === 0)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600'
              }`}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleCreateGroup}
              className="px-6 py-2 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600"
            >
              Create Bill
            </button>
          )}
        </div>
      </motion.div>
    </div>
  ) : null;
} 