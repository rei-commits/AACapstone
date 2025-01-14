import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createWorker } from 'tesseract.js';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ThemeToggle';
import { FiArrowLeft } from 'react-icons/fi';

const InstaSplit = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('manual');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [tax, setTax] = useState('');
  const [tip, setTip] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [splitResults, setSplitResults] = useState(null);
  const [splitType, setSplitType] = useState('equal');
  const [people, setPeople] = useState([
    { id: 1, name: 'Person 1', amount: 0, percentage: 0 }
  ]);

  // Receipt scanning functions
  const scanReceipt = async (file) => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    setIsScanning(true);
    console.log('Starting receipt scan...');

    try {
      console.log('Creating Tesseract worker...');
      const worker = await createWorker({
        logger: m => console.log(m)
      });

      console.log('Loading language...');
      await worker.loadLanguage('eng');
      
      console.log('Initializing...');
      await worker.initialize('eng');
      
      console.log('Starting recognition...');
      const { data: { text } } = await worker.recognize(file);
      console.log('Recognition complete. Text:', text);

      console.log('Parsing receipt text...');
      const result = parseReceiptText(text);
      console.log('Parsed result:', result);

      setScannedItems(result.items);
      setTotalAmount(result.subtotal.toFixed(2));
      // Store the actual tax amount directly
      const actualTax = result.tax.amount;
      console.log('Setting tax amount:', actualTax);
      setTax(actualTax.toFixed(2));
      setSplitResults(result);
      setTip(0); // Reset tip to 0 since it's from a scanned receipt

      console.log('Scan complete!');
      await worker.terminate();
    } catch (error) {
      console.error('Error during receipt scanning:', error);
      alert('There was an error scanning your receipt. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const parseReceiptText = (text) => {
    console.log('Starting text parsing...');
    const lines = text.split('\n');
    const itemsMap = new Map();
    let extractedTax = 0;
    let extractedTip = 0;
    let subtotal = 0;

    // Process each line
    lines.forEach(line => {
      // Skip empty lines and any lines containing "TOTAL"
      if (!line.trim() || /TOTAL/i.test(line)) {
        return;
      }

      // Check for tax
      if (/tax/i.test(line) && !/total/i.test(line)) {
        const taxMatch = line.match(/(\d+\.\d{2})/);
        if (taxMatch) {
          extractedTax = parseFloat(taxMatch[1]);
          console.log('Found tax amount:', extractedTax);
          return;
        }
      }

      // Try to match item with price
      const itemMatch = line.match(/^(\d*)\s*([^$\n]*?)\s*\$?\s*(\d+\.\d{2})\s*$/);
      if (!itemMatch) return;

      let [, quantityStr, itemName, priceStr] = itemMatch;
      
      // Get quantity from the start of line or default to 1
      let quantity = quantityStr ? parseInt(quantityStr) : 1;
      
      // Clean up item name
      itemName = itemName
        .replace(/\s+S$/i, '')  // Remove trailing S
        .trim()
        .toUpperCase();

      const price = parseFloat(priceStr);

      // Skip if this is a summary line
      const skipWords = [
        'SUBTOTAL', 'SUB-TOTAL', 'SUB TOTAL',
        'TOTAL', 'TOTAL:', 'TOTAL S',
        'TAX', 'SALES TAX', 'HST', 'GST', 'PST',
        'TIP', 'GRATUITY',
        'BALANCE', 'AMOUNT'
      ];

      if (skipWords.some(word => itemName.includes(word))) {
        return;
      }

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

    // Convert Map to array and calculate totals
    const items = Array.from(itemsMap.values());
    
    const result = {
      items,
      subtotal,
      tax: {
        amount: extractedTax,
        percentage: ((extractedTax / subtotal) * 100).toFixed(2)
      },
      tip: {
        amount: extractedTip,
        percentage: 0
      },
      total: subtotal + extractedTax + extractedTip
    };

    console.log('Final parsed result:', result);
    return result;
  };

  const addPerson = () => {
    setPeople([
      ...people,
      {
        id: people.length + 1,
        name: `Person ${people.length + 1}`,
        amount: 0,
        percentage: 0
      }
    ]);
    setNumberOfPeople(people.length + 1);
  };

  const removePerson = (id) => {
    if (people.length > 1) {
      setPeople(people.filter(person => person.id !== id));
      setNumberOfPeople(people.length - 1);
    }
  };

  const updatePersonAmount = (id, amount) => {
    setPeople(people.map(person => 
      person.id === id ? { ...person, amount: parseFloat(amount) || 0 } : person
    ));
  };

  const updatePersonPercentage = (id, percentage) => {
    setPeople(people.map(person => 
      person.id === id ? { ...person, percentage: parseFloat(percentage) || 0 } : person
    ));
  };

  const calculateSplit = () => {
    if (!totalAmount) {
      alert('Please enter a total amount');
      return;
    }

    if (splitType === 'custom') {
      // Check if any amounts have been entered
      const totalEntered = people.reduce((sum, person) => sum + (parseFloat(person.amount) || 0), 0);
      if (totalEntered === 0) {
        alert('Please enter amounts for at least one person');
        return;
      }
    }

    const subtotal = parseFloat(totalAmount);
    
    // Get the actual tax amount from scanned receipt or calculate from percentage
    const actualTaxAmount = scannedItems.length > 0 
      ? parseFloat(tax)  // Use actual tax amount from receipt
      : subtotal * (parseFloat(tax) || 0) / 100;

    // Calculate tip amount from the subtotal
    const tipAmount = subtotal * (parseFloat(tip) || 0) / 100;
    
    // Calculate total
    const total = subtotal + actualTaxAmount + tipAmount;

    // Always split tax and tip equally among ALL people
    const totalPeople = people.length;
    const taxPerPerson = actualTaxAmount / totalPeople;
    const tipPerPerson = tipAmount / totalPeople;

    console.log('Tax amount:', actualTaxAmount, 'Tax per person:', taxPerPerson);
    console.log('Tip amount:', tipAmount, 'Tip per person:', tipPerPerson);

    let results;
    if (splitType === 'equal') {
      const amountPerPerson = (total / numberOfPeople).toFixed(2);
      results = {
        subtotal,
        taxAmount: actualTaxAmount,
        tipAmount,
        total,
        amountPerPerson,
        numberOfPeople,
        splitType: 'equal'
      };
    } else {
      // Custom split calculation
      const customSplits = people.map(person => {
        const itemAmount = parseFloat(person.amount) || 0;
        
        // Everyone pays equal share of tax and tip
        const taxShare = taxPerPerson;  // Equal share of tax
        const tipShare = tipPerPerson;  // Equal share of tip
        const finalAmount = itemAmount + taxShare + tipShare;
        
        return {
          ...person,
          itemAmount: itemAmount.toFixed(2),
          taxShare: taxShare.toFixed(2),
          tipShare: tipShare.toFixed(2),
          finalAmount: finalAmount.toFixed(2)
        };
      });

      results = {
        subtotal,
        taxAmount: actualTaxAmount,
        tipAmount,
        total,
        customSplits,
        splitType: 'custom'
      };
    }

    setSplitResults(results);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 
                dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <FiArrowLeft className="w-5 h-5" />
            </motion.button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">InstaSplit</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      <div className={`min-h-screen ${darkMode ? 'bg-[#0A0A20]' : 'bg-gray-50'} py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${darkMode ? 'bg-white/5 backdrop-blur-xl' : 'bg-white'} rounded-3xl shadow-xl overflow-hidden`}
          >
            {/* Tab Selection */}
            <div className="flex border-b border-gray-200/10">
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'manual'
                    ? darkMode 
                      ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
                      : 'text-[#6D28D9] border-b-2 border-[#6D28D9]'
                    : darkMode
                      ? 'text-white/60 hover:text-white'
                      : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Manual Split
              </button>
              <button
                onClick={() => setActiveTab('scan')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'scan'
                    ? darkMode 
                      ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
                      : 'text-[#6D28D9] border-b-2 border-[#6D28D9]'
                    : darkMode
                      ? 'text-white/60 hover:text-white'
                      : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Scan Receipt
              </button>
            </div>

            <div className="p-6 lg:p-8">
              {activeTab === 'manual' ? (
                // Manual Split UI
                <div className="space-y-8">
                  {/* Total Amount Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                      Total Amount
                    </label>
                    <div className="relative">
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-2xl ${darkMode ? 'text-white/60' : 'text-gray-400'}`}>$</span>
                      <input
                        type="number"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        placeholder="0.00"
                        className={`w-full text-3xl p-4 pl-10 border rounded-2xl focus:ring-2 transition-colors ${
                          darkMode 
                            ? 'bg-white/5 border-white/10 text-white focus:ring-[#8B5CF6]/50'
                            : 'bg-white border-gray-200 text-gray-900 focus:ring-[#6D28D9]/50'
                        }`}
                      />
                    </div>
                  </motion.div>

                  {/* Number of People */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                      Number of People
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setNumberOfPeople(prev => Math.max(1, prev - 1))}
                        className={`p-3 rounded-xl transition-colors ${
                          darkMode
                            ? 'bg-white/5 hover:bg-white/10 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={numberOfPeople}
                        onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                        className={`w-24 p-3 text-center text-2xl border rounded-xl transition-colors ${
                          darkMode 
                            ? 'bg-white/5 border-white/10 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      />
                      <button
                        onClick={() => setNumberOfPeople(prev => prev + 1)}
                        className={`p-3 rounded-xl transition-colors ${
                          darkMode
                            ? 'bg-white/5 hover:bg-white/10 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>

                  {/* Tax and Tip */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-2 gap-6"
                  >
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                        Tax (%)
                      </label>
                      <input
                        type="number"
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        placeholder="0"
                        className={`w-full p-3 border rounded-xl transition-colors ${
                          darkMode 
                            ? 'bg-white/5 border-white/10 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                        Tip (%)
                      </label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={tip}
                          onChange={(e) => setTip(e.target.value)}
                          placeholder="0"
                          className={`w-full p-3 border rounded-xl transition-colors ${
                            darkMode 
                              ? 'bg-white/5 border-white/10 text-white'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                        <div className="flex gap-2">
                          {[15, 18, 20].map((tipValue) => (
                            <button
                              key={tipValue}
                              onClick={() => setTip(tipValue)}
                              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                tip === tipValue
                                  ? darkMode
                                    ? 'bg-[#8B5CF6] text-white'
                                    : 'bg-[#6D28D9] text-white'
                                  : darkMode
                                    ? 'bg-white/5 text-white/80 hover:bg-white/10'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {tipValue}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Split Type Selection */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="space-y-4"
                  >
                    <label className={`block text-sm font-medium ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                      Split Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setSplitType('equal')}
                        className={`p-4 rounded-xl text-center transition-colors ${
                          splitType === 'equal'
                            ? darkMode
                              ? 'bg-[#8B5CF6] text-white'
                              : 'bg-[#6D28D9] text-white'
                            : darkMode
                              ? 'bg-white/5 text-white/80 hover:bg-white/10'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Equal Split
                      </button>
                      <button
                        onClick={() => setSplitType('custom')}
                        className={`p-4 rounded-xl text-center transition-colors ${
                          splitType === 'custom'
                            ? darkMode
                              ? 'bg-[#8B5CF6] text-white'
                              : 'bg-[#6D28D9] text-white'
                            : darkMode
                              ? 'bg-white/5 text-white/80 hover:bg-white/10'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Custom Split
                      </button>
                    </div>
                  </motion.div>

                  {/* Custom Split UI */}
                  {splitType === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* Calculate tip amount */}
                      {(() => {
                        const subtotal = parseFloat(totalAmount);
                        const tipAmount = subtotal * (parseFloat(tip) || 0) / 100;
                        return (
                          <>
                            {/* Info message */}
                            <div className={`p-4 rounded-xl ${
                              darkMode ? 'bg-[#8B5CF6]/10' : 'bg-[#6D28D9]/5'
                            }`}>
                              <p className={`text-sm ${darkMode ? 'text-white/80' : 'text-gray-600'}`}>
                                Add all people splitting the bill. Tax (${parseFloat(tax).toFixed(2)}) and tip (${tipAmount.toFixed(2)}) will be split equally among everyone.
                              </p>
                            </div>

                            {people.map((person, index) => (
                              <div key={person.id} className={`p-4 rounded-xl ${
                                darkMode ? 'bg-white/5' : 'bg-gray-50'
                              }`}>
                                <div className="flex items-center justify-between mb-3">
                                  <input
                                    type="text"
                                    value={person.name}
                                    onChange={(e) => setPeople(people.map(p => 
                                      p.id === person.id ? { ...p, name: e.target.value } : p
                                    ))}
                                    className={`flex-1 text-sm font-medium p-2 rounded-lg ${
                                      darkMode 
                                        ? 'bg-white/10 text-white border-white/10' 
                                        : 'bg-white text-gray-900 border-gray-200'
                                    } border`}
                                    placeholder="Name"
                                  />
                                  {people.length > 1 && (
                                    <button
                                      onClick={() => removePerson(person.id)}
                                      className={`p-2 ml-2 rounded-lg ${
                                        darkMode
                                          ? 'text-white/60 hover:text-white/80 hover:bg-white/10'
                                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                                      }`}
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                                <div className="relative">
                                  <label className={`block text-sm mb-1 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                    Items Amount
                                  </label>
                                  <div className="relative">
                                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-white/60' : 'text-gray-400'}`}>$</span>
                                    <input
                                      type="number"
                                      value={person.amount || ''}
                                      onChange={(e) => updatePersonAmount(person.id, e.target.value)}
                                      placeholder="0.00"
                                      className={`w-full p-2 pl-8 border rounded-lg ${
                                        darkMode 
                                          ? 'bg-white/10 border-white/10 text-white' 
                                          : 'bg-white border-gray-200 text-gray-900'
                                      }`}
                                    />
                                    <p className={`mt-2 text-xs ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                                      + ${(parseFloat(tax) / people.length).toFixed(2)} tax share
                                      {tip > 0 && ` + $${(tipAmount / people.length).toFixed(2)} tip share`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        );
                      })()}
                      <button
                        onClick={addPerson}
                        className={`w-full py-4 rounded-xl font-medium transition-colors ${
                          darkMode
                            ? 'bg-[#8B5CF6]/20 text-white hover:bg-[#8B5CF6]/30'
                            : 'bg-[#6D28D9]/10 text-[#6D28D9] hover:bg-[#6D28D9]/20'
                        }`}
                      >
                        Add Another Person
                      </button>
                    </motion.div>
                  )}

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    onClick={calculateSplit}
                    className={`w-full py-4 rounded-2xl font-medium text-white transition-colors ${
                      darkMode
                        ? 'bg-[#8B5CF6] hover:bg-[#7C3AED]'
                        : 'bg-[#6D28D9] hover:bg-[#5B21B6]'
                    }`}
                  >
                    Calculate Split
                  </motion.button>

                  {/* Results Section */}
                  {showResults && splitResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-8 rounded-2xl p-6 ${
                        darkMode
                          ? 'bg-white/5'
                          : 'bg-gray-50'
                      }`}
                    >
                      <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Split Results
                      </h3>
                      
                      <div className="space-y-3">
                        <div className={`flex justify-between ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                          <span>Subtotal:</span>
                          <span>${splitResults.subtotal.toFixed(2)}</span>
                        </div>
                        {splitResults.taxAmount > 0 && (
                          <div className={`flex justify-between ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                            <span>Tax ({tax}%):</span>
                            <span>${splitResults.taxAmount.toFixed(2)}</span>
                          </div>
                        )}
                        {splitResults.tipAmount > 0 && (
                          <div className={`flex justify-between ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                            <span>Tip ({tip}%):</span>
                            <span>${splitResults.tipAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className={`flex justify-between font-medium border-t pt-3 ${darkMode ? 'text-white border-white/10' : 'text-gray-900 border-gray-200'}`}>
                          <span>Total:</span>
                          <span>${splitResults.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        {splitResults.splitType === 'equal' ? (
                          <div className={`p-6 rounded-xl text-center ${
                            darkMode
                              ? 'bg-[#8B5CF6]/10'
                              : 'bg-[#6D28D9]/5'
                          }`}>
                            <p className={`mb-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Each person pays</p>
                            <p className={`text-4xl font-bold ${
                              darkMode
                                ? 'text-[#8B5CF6]'
                                : 'text-[#6D28D9]'
                            }`}>
                              ${splitResults.amountPerPerson}
                            </p>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                              Split equally between {splitResults.numberOfPeople} people
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {splitResults.customSplits.map((person) => (
                              <div key={person.id} className={`p-4 rounded-xl ${
                                darkMode ? 'bg-[#8B5CF6]/10' : 'bg-[#6D28D9]/5'
                              }`}>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {person.name}
                                    </p>
                                    <p className={`text-xl font-bold ${
                                      darkMode
                                        ? 'text-[#8B5CF6]'
                                        : 'text-[#6D28D9]'
                                    }`}>
                                      ${person.finalAmount}
                                    </p>
                                  </div>
                                  <div className={`text-sm space-y-1 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                    <div className="flex justify-between">
                                      <span>Items:</span>
                                      <span>${person.itemAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Tax Share:</span>
                                      <span>+${person.taxShare}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Tip Share:</span>
                                      <span>+${person.tipShare}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                // Receipt Scanner UI
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                      darkMode
                        ? 'border-white/10 hover:border-white/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => scanReceipt(e.target.files[0])}
                      className="hidden"
                      id="receipt-upload"
                    />
                    <label
                      htmlFor="receipt-upload"
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      <div className={`p-4 rounded-full ${
                        darkMode
                          ? 'bg-[#8B5CF6]/10'
                          : 'bg-[#6D28D9]/5'
                      }`}>
                        <svg className={`w-8 h-8 ${
                          darkMode
                            ? 'text-[#8B5CF6]'
                            : 'text-[#6D28D9]'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Upload Receipt
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                        Click to scan your receipt
                      </span>
                    </label>
                  </motion.div>

                  {isScanning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto ${
                        darkMode
                          ? 'border-[#8B5CF6]'
                          : 'border-[#6D28D9]'
                      }`}></div>
                      <p className={`mt-4 font-medium ${darkMode ? 'text-white/80' : 'text-gray-600'}`}>
                        Scanning your receipt...
                      </p>
                    </motion.div>
                  )}

                  {scannedItems.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Scanned Items
                      </h3>
                      <div className={`rounded-xl p-4 space-y-2 ${
                        darkMode
                          ? 'bg-white/5'
                          : 'bg-gray-50'
                      }`}>
                        {scannedItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                              <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>
                                {item.name}
                              </span>
                              {item.quantity > 1 && (
                                <span className={`text-sm px-2 py-0.5 rounded ${
                                  darkMode 
                                    ? 'bg-white/10 text-white/60' 
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  ×{item.quantity}
                                </span>
                              )}
                            </div>
                            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              ${item.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        ))}
                        
                        <div className={`border-t pt-3 mt-3 space-y-2 ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-white/60' : 'text-gray-600'}>Subtotal</span>
                            <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>
                              ${scannedItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                            </span>
                          </div>
                          
                          {tax > 0 && (
                            <div className="flex justify-between">
                              <span className={darkMode ? 'text-white/60' : 'text-gray-600'}>
                                Tax ({((parseFloat(tax) / scannedItems.reduce((sum, item) => sum + item.totalPrice, 0)) * 100).toFixed(2)}%)
                              </span>
                              <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>
                                ${parseFloat(tax).toFixed(2)}
                              </span>
                            </div>
                          )}
                          
                          {tip > 0 && (
                            <div className="flex justify-between">
                              <span className={darkMode ? 'text-white/60' : 'text-gray-600'}>
                                Tip ({tip}%)
                              </span>
                              <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>
                                ${((scannedItems.reduce((sum, item) => sum + item.totalPrice, 0) * tip) / 100).toFixed(2)}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex justify-between font-medium pt-2 border-t border-dashed">
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>Total</span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                              ${totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('manual')}
                        className={`w-full py-4 rounded-xl font-medium text-white transition-colors ${
                          darkMode
                            ? 'bg-[#8B5CF6] hover:bg-[#7C3AED]'
                            : 'bg-[#6D28D9] hover:bg-[#5B21B6]'
                        }`}
                      >
                        Continue to Split
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InstaSplit; 