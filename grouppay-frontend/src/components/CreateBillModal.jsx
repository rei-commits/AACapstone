import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiUpload, FiPlus, FiCheck, FiEdit2, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { createWorker } from 'tesseract.js';

const CreateBillModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  
  // Mock friends data
  const friends = [
    {
      id: '1',
      name: 'Charly',
      avatar: 'C',
      color: 'bg-purple-600'
    },
    {
      id: '2',
      name: 'Tiana',
      avatar: 'T',
      color: 'bg-pink-600'
    },
    {
      id: '3',
      name: 'Jonel',
      avatar: 'J',
      color: 'bg-orange-600'
    }
  ];

  const [billDetails, setBillDetails] = useState({
    title: '',
    emoji: '🧾',
    amount: '',
    description: '',
    participants: [],
    tipPercentage: 20,
    taxPercentage: 8,
    customTipPercentage: '',
    items: []
  });
  const [selectedEmoji, setSelectedEmoji] = useState('🧾');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [errors, setErrors] = useState({});
  const [isScanning, setIsScanning] = useState(false);
  const emojiPickerRef = useRef(null);
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const commonEmojis = [
    // Food & Dining
    '🧾', '🌮', '🍔', '🍕', '🍜', '🍱', '🍣', '🍖', '🥗', '🥘', '🌯', '🥪',
    // Drinks & Bar
    '🍺', '🍷', '🍸', '🍹', '☕️', '🧃',
    // Entertainment
    '🎬', '🎮', '🎭', '🎪', '🎯', '🎳',
    // Activities & Sports
    '⚽️', '🏀', '🎱', '🏊‍♂️', '🎨', '🎲',
    // Shopping & Retail
    '🛍️', '👕', '👗', '👟', '💄', '💻',
    // Travel & Transport
    '✈️', '🚗', '🚕', '🚂', '⛴️', '🏖️',
    // Bills & Utilities
    '🏠', '💡', '📱', '⛽️', '🛒', '💰'
  ];

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!billDetails.title) newErrors.title = 'Title is required';
      if (!billDetails.amount && scannedItems.length === 0) newErrors.amount = 'Amount is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const parseReceiptText = (text) => {
    console.log('Starting text parsing...');
    const lines = text.split('\n');
    const itemsMap = new Map();
    let extractedTax = 0;
    let subtotal = 0;

    lines.forEach(line => {
      // Skip empty lines
      if (!line.trim()) return;

      // Skip any lines containing summary-like patterns
      if (
        /TOTAL\s*:?\s*S\s*S?/i.test(line) || // Skip TOTAL: S or TOTAL: S S
        /^TOTAL\s*:?\s*\$?/i.test(line) ||   // Skip lines starting with TOTAL:
        /^S\s*$/i.test(line) ||              // Skip just "S"
        /^TOTAL\s*S$/i.test(line)            // Skip TOTAL S
      ) {
        return;
      }

      // Extract tax if present but don't add it as an item
      if (/tax/i.test(line)) {
        const taxMatch = line.match(/(\d+\.\d{2})/);
        if (taxMatch) {
          extractedTax = parseFloat(taxMatch[1]);
          console.log('Found tax amount:', extractedTax);
        }
        return;
      }

      // Skip any summary lines (subtotal, total, tax, etc.)
      if (/^(subtotal|total|tax|tip|balance|amount|sum)/i.test(line)) {
        return;
      }

      // Try to match item with price - more lenient pattern but exclude summary patterns
      const itemMatch = line.match(/(\d*)\s*([^$\n]*?)\s*\$?\s*(\d+\.\d{2})\s*$/);
      if (!itemMatch) return;

      let [, quantityStr, itemName, priceStr] = itemMatch;
      
      // Clean up item name
      itemName = itemName.trim().toUpperCase();
      
      // Skip if it contains any summary-related patterns
      if (
        /TOTAL|SUBTOTAL|^S$|S\s*S$/i.test(itemName) ||  // Skip any variations of TOTAL/S
        itemName.length < 2 ||                          // Too short
        /^(TAX|TIP|BALANCE|SUM)/i.test(itemName)       // Other summary keywords
      ) {
        return;
      }

      // Clean up common OCR mistakes in item names
      itemName = itemName
        .replace(/BOTTLE\s*S\b/i, 'BOTTLE')
        .replace(/STEAK\s*S\b/i, 'STEAK')
        .replace(/STERKS?\b/i, 'STEAK')
        .replace(/\s+S$/, '');  // Remove trailing S after cleaning

      const price = parseFloat(priceStr);
      const quantity = parseInt(quantityStr) || 1;

      // Get or create item in map
      const existingItem = itemsMap.get(itemName);
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
      } else {
        itemsMap.set(itemName, {
          id: Math.random().toString(36).substr(2, 9),
          name: itemName,
          price: price,
          quantity: quantity,
          totalPrice: price * quantity
        });
      }
      subtotal += price * quantity;
    });

    // Update subtotal to use totalPrice
    subtotal = Array.from(itemsMap.values()).reduce((total, item) => total + item.totalPrice, 0);
    
    // Convert Map to array and ensure no summary items made it through
    const items = Array.from(itemsMap.values()).filter(item => {
      const name = item.name.toUpperCase();
      return !(
        /^(SUBTOTAL|TOTAL|TAX|TIP|BALANCE|SUM)/i.test(name) ||
        /^S\s*$/i.test(name) ||
        /TOTAL\s*S/i.test(name)
      );
    });
    
    return {
      items,
      subtotal,
      tax: {
        amount: extractedTax,
        percentage: ((extractedTax / subtotal) * 100).toFixed(2)
      }
    };
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsScanning(true);
    console.log('Starting receipt scan...');

    try {
      // Create a file URL for the image
      const imageUrl = URL.createObjectURL(file);

      console.log('Creating Tesseract worker...');
      const worker = await createWorker({
        logger: m => console.log(m)
      });

      console.log('Loading language...');
      await worker.loadLanguage('eng');
      
      console.log('Initializing...');
      await worker.initialize('eng');
      
      console.log('Starting recognition...');
      const { data: { text } } = await worker.recognize(imageUrl);
      console.log('Recognition complete. Text:', text);

      console.log('Parsing receipt text...');
      const result = parseReceiptText(text);
      console.log('Parsed result:', result);

      // Update both states with the parsed items directly
      setScannedItems(result.items);
      setBillDetails(prev => ({
        ...prev,
        items: result.items,
        amount: result.items.reduce((total, item) => total + item.totalPrice, 0).toFixed(2),
        taxPercentage: parseFloat(result.tax.percentage) || prev.taxPercentage
      }));

      console.log('Scan complete!');
      await worker.terminate();
      
      // Clean up the URL
      URL.revokeObjectURL(imageUrl);
    } catch (error) {
      console.error('Error during receipt scanning:', error);
      alert('There was an error scanning your receipt. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const startCamera = () => {
    setShowScanner(true);
  };

  const stopCamera = () => {
    setShowScanner(false);
  };

  const capturePhoto = () => {
    // Handle photo capture logic
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(billDetails.amount);
    const tax = subtotal * (billDetails.taxPercentage / 100);
    const tip = subtotal * (billDetails.tipPercentage / 100);
    return (subtotal + tax + tip).toFixed(2);
  };

  const calculateShare = (participantId) => {
    const assignedItems = billDetails.items.filter(item => 
      item.assignedTo === participantId || 
      (item.assignedTo === 'split' && participantId)
    );

    const itemsTotal = assignedItems.reduce((sum, item) => {
      if (item.assignedTo === 'split') {
        // Split items equally among all participants
        return sum + (item.price * item.quantity) / (billDetails.participants.length + 1);
      }
      return sum + (item.price * item.quantity);
    }, 0);

    // Calculate share of tax and tip
    const totalParticipants = billDetails.participants.length + 1;
    const taxShare = (parseFloat(billDetails.amount) * billDetails.taxPercentage / 100) / totalParticipants;
    const tipShare = (parseFloat(billDetails.amount) * billDetails.tipPercentage / 100) / totalParticipants;

    return itemsTotal.toFixed(2);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const toggleEditPrice = (itemId) => {
    setEditingItemId(editingItemId === itemId ? null : itemId);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 p-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-medium text-white">Create a Bill</h2>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#252540] text-2xl hover:bg-[#313150]"
                >
                  {selectedEmoji}
                </button>
                <div className="flex-1">
                  <label className="mb-1 block text-sm text-gray-300">Bill Title</label>
                  <input
                    type="text"
                    value={billDetails.title}
                    onChange={(e) => setBillDetails({ ...billDetails, title: e.target.value })}
                    className="w-full rounded-lg bg-[#252540] py-2 px-3 text-white"
                    placeholder="Enter bill title"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>
              </div>

              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="relative z-50">
                  <div className="absolute left-0 top-0 rounded-lg bg-[#252540] p-2 shadow-xl w-full">
                    <div className="grid grid-cols-6 gap-2">
                      {commonEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedEmoji(emoji);
                            setBillDetails(prev => ({ ...prev, emoji }));
                            setShowEmojiPicker(false);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#313150]"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Receipt Upload/Scan */}
            {!billDetails.items.length && !showScanner && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center gap-2 rounded-lg bg-[#252540] py-4 text-gray-300 hover:bg-[#313150]"
                >
                  <FiCamera className="h-5 w-5" />
                  <span className="text-sm">Take Photo</span>
                </button>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-[#252540] py-4 text-gray-300 hover:bg-[#313150]">
                  <FiUpload className="h-5 w-5" />
                  <span className="text-sm">Upload Receipt</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
              </div>
            )}

            {isScanning && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#6366F1] border-t-transparent"></div>
                <p className="mt-4 text-gray-300">Scanning your receipt...</p>
              </div>
            )}

            {billDetails.items.length > 0 && (
              <>
                <h3 className="text-base font-medium text-white">Scanned Items</h3>
                <div className="space-y-2">
                  {billDetails.items
                    .filter(item => {
                      const name = item.name.toUpperCase();
                      // Strictly filter out any summary-related items
                      return !(
                        /SUBTOTAL|TOTAL|TAX|TIP|BALANCE|SUM|^S$/i.test(name) ||
                        name.includes('SUBTOTAL') ||
                        name.includes('TAX') ||
                        name.includes('TOTAL')
                      );
                    })
                    .map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-[#252540] p-3">
                      <div>
                        <p className="text-white">
                          {item.name}
                          {item.quantity > 1 && (
                            <span className="ml-2 text-sm text-gray-400">
                              × {item.quantity}
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2">
                          {editingItemId === item.id ? (
                            <>
                              <span className="text-sm text-gray-400">$</span>
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => {
                                  const newPrice = parseFloat(e.target.value) || 0;
                                  const newItems = [...billDetails.items];
                                  newItems[index] = {
                                    ...item,
                                    price: newPrice,
                                    totalPrice: newPrice * item.quantity
                                  };
                                  setBillDetails({
                                    ...billDetails,
                                    items: newItems,
                                    amount: newItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
                                  });
                                }}
                                className="w-20 bg-[#313150] px-2 py-1 text-sm text-white rounded"
                                step="0.01"
                                min="0"
                                autoFocus
                                onBlur={() => setEditingItemId(null)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    setEditingItemId(null);
                                  }
                                }}
                              />
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">
                                ${item.price.toFixed(2)}
                                {item.quantity > 1 && ` × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`}
                              </span>
                              <button
                                onClick={() => toggleEditPrice(item.id)}
                                className="p-1 text-gray-400 hover:text-gray-300"
                              >
                                <FiEdit2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            const newItems = billDetails.items.filter((_, i) => i !== index);
                            setBillDetails({
                              ...billDetails,
                              items: newItems,
                              amount: newItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
                            });
                          }}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-3 rounded-lg bg-[#252540] p-4">
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Subtotal:</span>
                      <span>${billDetails.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-300">Tax (%)</label>
                      <input
                        type="number"
                        value={billDetails.taxPercentage}
                        onChange={(e) => setBillDetails({ ...billDetails, taxPercentage: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg bg-[#313150] py-2 px-3 text-white"
                        placeholder="Enter tax percentage"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-300">Tip</label>
                      <div className="flex gap-2">
                        {[15, 18, 20].map((percentage) => (
                          <button
                            key={percentage}
                            onClick={() => setBillDetails({ ...billDetails, tipPercentage: percentage })}
                            className={`rounded-lg px-4 py-2 text-sm ${
                              billDetails.tipPercentage === percentage
                                ? 'bg-indigo-600 text-white'
                                : 'bg-[#313150] text-gray-300 hover:bg-[#414160]'
                            }`}
                          >
                            {percentage}%
                          </button>
                        ))}
                        <input
                          type="number"
                          value={billDetails.customTipPercentage}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            setBillDetails({
                              ...billDetails,
                              customTipPercentage: e.target.value,
                              tipPercentage: value
                            });
                          }}
                          className="w-20 rounded-lg bg-[#313150] py-2 px-3 text-sm text-white"
                          placeholder="Custom"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-gray-700 pt-3">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Subtotal:</span>
                        <span>${billDetails.amount}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Tax ({billDetails.taxPercentage}%):</span>
                        <span>${(parseFloat(billDetails.amount) * (billDetails.taxPercentage / 100)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Tip ({billDetails.tipPercentage}%):</span>
                        <span>${(parseFloat(billDetails.amount) * (billDetails.tipPercentage / 100)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 text-sm font-medium text-white">
                        <span>Total:</span>
                        <span>${calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 p-4">
            <h3 className="text-xl font-semibold text-white">Add Participants</h3>
            
            {/* Friends List - Horizontally Scrollable */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-400">Select Friends</h4>
              <div className="flex overflow-x-auto space-x-3 pb-2">
                {/* You (Host) */}
                <div className="flex flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600/20 text-green-400 text-lg">
                    You
                  </div>
                  <span className="mt-2 text-xs text-gray-400">Host</span>
                </div>

                {/* Friends */}
                {friends.map((friend) => (
                  <div key={friend.id} className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        const isSelected = billDetails.participants.some(p => p.id === friend.id);
                        if (isSelected) {
                          setBillDetails({
                            ...billDetails,
                            participants: billDetails.participants.filter(p => p.id !== friend.id)
                          });
                        } else {
                          setBillDetails({
                            ...billDetails,
                            participants: [...billDetails.participants, friend]
                          });
                        }
                      }}
                      className={`flex h-14 w-14 items-center justify-center rounded-full text-lg transition-all ${
                        billDetails.participants.some(p => p.id === friend.id)
                          ? `${friend.color} text-white ring-2 ring-offset-2 ring-offset-[#1A1A2E] ring-${friend.color}`
                          : `${friend.color}/20 text-${friend.color} hover:${friend.color}/30`
                      }`}
                    >
                      {friend.name.split(' ').map(n => n[0]).join('')}
                    </button>
                    <span className="mt-2 text-xs text-gray-400">
                      {friend.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Members Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-400">Invite Non-Members</h4>
              {billDetails.nonMembers?.map((nonMember, index) => (
                <div key={index} className="rounded-lg bg-[#252540] p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600/20 text-gray-400">
                        <FiUser className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="tel"
                          value={nonMember.phone}
                          onChange={(e) => {
                            const newNonMembers = [...(billDetails.nonMembers || [])];
                            newNonMembers[index].phone = e.target.value;
                            setBillDetails({
                              ...billDetails,
                              nonMembers: newNonMembers
                            });
                          }}
                          placeholder="Enter phone number"
                          className="w-full rounded-lg bg-[#313150] px-3 py-2 text-white text-sm"
                        />
                        <div className="mt-2 text-xs text-gray-400">
                          They'll receive a text with a link to join the bill
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setBillDetails({
                          ...billDetails,
                          nonMembers: billDetails.nonMembers?.filter((_, i) => i !== index)
                        });
                      }}
                      className="ml-2 text-red-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  setBillDetails({
                    ...billDetails,
                    nonMembers: [...(billDetails.nonMembers || []), { phone: '' }]
                  });
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#252540] p-3 text-gray-300 hover:bg-[#313150]"
              >
                <FiPlus className="h-5 w-5" />
                <span>Add Non-Member</span>
              </button>
            </div>

            {/* SMS Message Preview */}
            <div className="rounded-lg bg-[#252540] p-3">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Invitation Message Preview</h4>
              <div className="text-sm text-gray-300 bg-[#313150] p-3 rounded-lg">
                "Hey! You've been invited to split the bill for {billDetails.title} 🧾. Click the link to join and select your items: [GroupPay Link]. No app download required!"
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 p-4">
            <h3 className="text-xl font-semibold text-white">Review & Confirm</h3>
            
            {/* Bill Header */}
            <div className="rounded-lg bg-[#1F1F3A] p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#313150] text-2xl">
                  {selectedEmoji}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">{billDetails.title}</h4>
                  <p className="text-sm text-gray-400">
                    {billDetails.participants.length + 1} participants
                  </p>
                </div>
              </div>

              {/* Scanned Items with Selection */}
              <div className="space-y-3">
                <h5 className="font-medium text-white">Select Items</h5>
                {billDetails.items.map((item) => (
                  <div key={item.id} className="rounded-lg bg-[#252540] p-3">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">
                            {item.name}
                            {item.quantity > 1 && (
                              <span className="ml-2 text-sm text-gray-400">
                                × {item.quantity}
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-400">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Profile Bubbles */}
                      <div className="flex flex-wrap gap-2">
                        {/* Your bubble */}
                        <button
                          onClick={() => {
                            const newItems = [...billDetails.items];
                            const index = newItems.findIndex(i => i.id === item.id);
                            newItems[index] = {
                              ...item,
                              assignedTo: item.assignedTo === 'you' ? '' : 'you'
                            };
                            setBillDetails({
                              ...billDetails,
                              items: newItems
                            });
                          }}
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all ${
                            item.assignedTo === 'you'
                              ? 'bg-green-600 text-white ring-2 ring-green-400 ring-offset-2 ring-offset-[#252540]'
                              : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                          }`}
                        >
                          You
                        </button>

                        {/* Friend bubbles */}
                        {billDetails.participants.map((friend) => (
                          <button
                            key={friend.id}
                            onClick={() => {
                              const newItems = [...billDetails.items];
                              const index = newItems.findIndex(i => i.id === item.id);
                              newItems[index] = {
                                ...item,
                                assignedTo: item.assignedTo === friend.id ? '' : friend.id
                              };
                              setBillDetails({
                                ...billDetails,
                                items: newItems
                              });
                            }}
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all ${
                              item.assignedTo === friend.id
                                ? `${friend.color} text-white ring-2 ring-offset-2 ring-offset-[#252540] ring-${friend.color}`
                                : `${friend.color}/20 text-${friend.color} hover:bg-${friend.color}/30`
                            }`}
                          >
                            {friend.avatar}
                          </button>
                        ))}

                        {/* Split equally button */}
                        <button
                          onClick={() => {
                            const newItems = [...billDetails.items];
                            const index = newItems.findIndex(i => i.id === item.id);
                            newItems[index] = {
                              ...item,
                              assignedTo: item.assignedTo === 'split' ? '' : 'split'
                            };
                            setBillDetails({
                              ...billDetails,
                              items: newItems
                            });
                          }}
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all ${
                            item.assignedTo === 'split'
                              ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-[#252540]'
                              : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                          }`}
                        >
                          All
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Summary */}
              <div className="mt-4 space-y-2 border-t border-gray-700 pt-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>${billDetails.amount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Tax ({billDetails.taxPercentage}%)</span>
                  <span>${(parseFloat(billDetails.amount) * billDetails.taxPercentage / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Tip ({billDetails.tipPercentage}%)</span>
                  <span>${(parseFloat(billDetails.amount) * billDetails.tipPercentage / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-medium text-white border-t border-gray-700">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="mt-6 space-y-4">
              <h4 className="font-medium text-white">Your Payment Options</h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center gap-2 rounded-lg bg-[#252540] p-4 text-white hover:bg-[#313150]">
                  <span className="text-2xl">💳</span>
                  <span className="text-sm">Pay Now</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 rounded-lg bg-[#252540] p-4 text-white hover:bg-[#313150]">
                  <span className="text-2xl">⏱️</span>
                  <span className="text-sm">Pay Later</span>
                </button>
              </div>
              <div className="text-center text-sm text-gray-400">
                Others will receive a notification to pay their share
              </div>
            </div>

            {/* Payment Status */}
            <div className="mt-6">
              <h4 className="font-medium text-white mb-3">Payment Status</h4>
              <div className="space-y-3">
                {/* Your Status */}
                <div className="flex items-center justify-between rounded-lg bg-[#252540] p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600/20 text-green-400">
                      You
                    </div>
                    <span className="text-white">Your Share</span>
                  </div>
                  <span className="text-sm text-yellow-400">Pending Payment</span>
                </div>
                
                {/* Other Participants Status */}
                {billDetails.participants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg bg-[#252540] p-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${p.color} text-white`}>
                        {p.avatar}
                      </div>
                      <span className="text-white">{p.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">Waiting for Payment</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="w-full max-w-md overflow-hidden rounded-xl bg-[#1A1A2E] shadow-xl"
          >
            <div className="max-h-[85vh] overflow-y-auto">
              {renderStepContent()}
            </div>

            <div className="flex justify-between border-t border-gray-800 bg-[#1A1A2E] px-4 py-3">
              <div>
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
                  >
                    Back
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                >
                  {step === 3 ? 'Create Bill' : 'Next'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateBillModal; 