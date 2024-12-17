import React, { useState } from 'react';
import { FiUsers, FiDollarSign } from 'react-icons/fi';
import { createWorker } from 'tesseract.js';

const BillSplitter = () => {
  const [billAmount, setBillAmount] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [tipPercentage, setTipPercentage] = useState('');
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});  // { userId: [itemIds] }
  const [participants] = useState([]);
  const [userTotal, setUserTotal] = useState(0);
  const [tax, setTax] = useState('');
  const [scannerTip, setScannerTip] = useState('');

  const currentUserId = '1'; // Temporary - will come from auth later

  const handleCalculate = () => {
    const bill = parseFloat(billAmount);
    const people = parseInt(numPeople);
    const tip = parseFloat(tipPercentage);

    if (bill && people) {
      const tipAmount = bill * (tip / 100);
      const totalAmount = bill + tipAmount;
      const perPerson = totalAmount / people;

      setResult({
        totalWithTip: totalAmount.toFixed(2),
        perPerson: perPerson.toFixed(2),
        tipAmount: tipAmount.toFixed(2)
      });
    }
  };

  const handleReset = () => {
    setBillAmount('');
    setNumPeople('');
    setTipPercentage('');
    setResult(null);
  };

  const scanReceipt = async (file) => {
    setIsScanning(true);
    const worker = await createWorker();
    
    try {
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(file);
      
      // Parse receipt text to extract items and prices
      const items = parseReceiptText(text);
      setScannedItems(items);
    } catch (error) {
      console.error('Error scanning receipt:', error);
    } finally {
      await worker.terminate();
      setIsScanning(false);
    }
  };

  const parseReceiptText = (text) => {
    const lines = text.split('\n');
    const items = [];
    
    lines.forEach(line => {
      // Look for price at the end of line with $ symbol
      const match = line.match(/^(.*?)\$\s*(\d+\.\d{2})\s*$/);
      if (match) {
        // Clean up the item name
        let itemName = match[1].trim();
        itemName = itemName.replace(/^\d+\s*/, ''); // Remove leading numbers
        itemName = itemName.replace(/[^a-zA-Z\s]+$/, ''); // Remove trailing non-letters
        
        // Skip if the item is SUBTOTAL, TOTAL, TAX, or similar summary items
        const skipWords = ['SUBTOTAL', 'TOTAL', 'TAX', 'TIP', 'BALANCE'];
        const shouldSkip = skipWords.some(word => itemName.toUpperCase().includes(word));
        
        // Only add if we have both a name and a valid price, and it's not a summary item
        if (itemName && !isNaN(match[2]) && !shouldSkip) {
          items.push({
            id: Math.random().toString(36).substr(2, 9),
            name: itemName.toUpperCase(), // Convert to uppercase for consistency
            price: parseFloat(match[2]),
            selectedBy: []
          });
        }
      }
    });
    
    return items;
  };

  const calculateTotalWithExtras = (subtotal) => {
    const taxAmount = subtotal * (parseFloat(tax) || 0) / 100;
    const tipAmount = subtotal * (parseFloat(scannerTip) || 0) / 100;
    return {
      subtotal,
      taxAmount,
      tipAmount,
      total: subtotal + taxAmount + tipAmount
    };
  };

  const calculateUserTotal = (selections) => {
    const userItems = selections[currentUserId] || [];
    const subtotal = scannedItems
      .filter(item => userItems.includes(item.id))
      .reduce((sum, item) => sum + item.price, 0);
    
    const { total } = calculateTotalWithExtras(subtotal);
    setUserTotal(total);
  };

  const handleItemSelect = (itemId) => {
    const item = scannedItems.find(i => i.id === itemId);
    
    if (item) {
      const isSelected = selectedItems[currentUserId]?.includes(itemId);
      let newSelectedItems;
      
      if (isSelected) {
        // Remove the selection
        newSelectedItems = {
          ...selectedItems,
          [currentUserId]: selectedItems[currentUserId].filter(id => id !== itemId)
        };
        setSelectedItems(newSelectedItems);
        
        setScannedItems(items => items.map(i => 
          i.id === itemId 
            ? { ...i, selectedBy: i.selectedBy.filter(userId => userId !== currentUserId) }
            : i
        ));
      } else {
        // Add the selection
        newSelectedItems = {
          ...selectedItems,
          [currentUserId]: [...(selectedItems[currentUserId] || []), itemId]
        };
        setSelectedItems(newSelectedItems);
        
        setScannedItems(items => items.map(i => 
          i.id === itemId 
            ? { ...i, selectedBy: [...i.selectedBy, currentUserId] }
            : i
        ));
      }
      
      // Calculate new total after selection/deselection
      calculateUserTotal(newSelectedItems);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Bill Splitter</h1>
        <p className="text-gray-600">Split bills easily with friends and keep track of expenses</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Manual Split */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-lg">
                <FiDollarSign className="text-blue-600 w-5 h-5" />
              </span>
              Manual Split
            </h2>

            {/* Bill Amount Input */}
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Total Bill Amount ($)
                </label>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Number of People Input */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Number of People
                </label>
                <input
                  type="number"
                  value={numPeople}
                  onChange={(e) => setNumPeople(e.target.value)}
                  placeholder="Enter number"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Tip Section */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Tip Percentage
                </label>
                <div className="flex gap-2 mb-3">
                  {[10, 15, 20].map((tip) => (
                    <button
                      key={tip}
                      onClick={() => setTipPercentage(tip)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        tipPercentage === tip
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {tip}%
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={tipPercentage}
                  onChange={(e) => setTipPercentage(e.target.value)}
                  placeholder="Custom tip %"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCalculate}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium"
                >
                  Calculate Split
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Results Section */}
              {result && (
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total with tip:</span>
                    <span className="font-bold text-lg">${result.totalWithTip}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tip amount:</span>
                    <span className="font-bold text-lg">${result.tipAmount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                    <span className="font-medium text-blue-800">Each person pays:</span>
                    <span className="font-bold text-2xl text-blue-600">${result.perPerson}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Receipt Scanner */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="bg-purple-100 p-2 rounded-lg">
                <FiUsers className="text-purple-600 w-5 h-5" />
              </span>
              Receipt Scanner
            </h2>

            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-6">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => scanReceipt(e.target.files[0])}
                className="hidden"
                id="receipt-upload"
              />
              <label
                htmlFor="receipt-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <div className="bg-purple-100 p-4 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Upload Receipt</span>
                <span className="text-sm text-gray-500">Click to scan your receipt</span>
              </label>
            </div>

            {/* Scanning Indicator */}
            {isScanning && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
                <p className="mt-4 text-gray-600 font-medium">Scanning your receipt...</p>
              </div>
            )}

            {/* Scanned Items */}
            {scannedItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Scanned Items</h3>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Your Total</p>
                    <p className="text-xl font-bold text-green-600">
                      ${userTotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {scannedItems.map(item => {
                    const isSelected = selectedItems[currentUserId]?.includes(item.id);
                    return (
                      <div 
                        key={item.id}
                        className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                          isSelected ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleItemSelect(item.id)}
                              className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                            />
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className={`font-medium ${isSelected ? 'text-green-700' : 'text-gray-700'}`}>
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Selected By Avatars */}
                        <div className="flex -space-x-2">
                          {item.selectedBy.map(userId => {
                            const user = participants.find(p => p.id === userId);
                            return user && (
                              <div
                                key={userId}
                                className={`w-8 h-8 rounded-full ${user.color} border-2 border-white flex items-center justify-center text-sm font-medium shadow-sm`}
                                title={user.name}
                              >
                                {user.initials}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Running Total Footer */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Selected Items</p>
                      <p className="text-lg font-medium">
                        {selectedItems[currentUserId]?.length || 0} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Your Total</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${userTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tax and Tip Section */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-4">Additional Charges</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Tax (%)
                      </label>
                      <input
                        type="number"
                        value={tax}
                        onChange={(e) => {
                          setTax(e.target.value);
                          calculateUserTotal(selectedItems);
                        }}
                        placeholder="Enter tax %"
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Tip (%)
                      </label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={scannerTip}
                          onChange={(e) => {
                            setScannerTip(e.target.value);
                            calculateUserTotal(selectedItems);
                          }}
                          placeholder="Enter tip %"
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <div className="flex gap-2">
                          {[15, 18, 20].map((tipValue) => (
                            <button
                              key={tipValue}
                              onClick={() => {
                                setScannerTip(tipValue);
                                calculateUserTotal(selectedItems);
                              }}
                              className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
                                scannerTip === tipValue
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {tipValue}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Updated Total Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>${userTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax ({tax}%):</span>
                      <span>${(userTotal * (parseFloat(tax) || 0) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tip ({scannerTip}%):</span>
                      <span>${(userTotal * (parseFloat(scannerTip) || 0) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-purple-600 pt-2 border-t">
                      <span>Total:</span>
                      <span>
                        ${(userTotal * (1 + (parseFloat(tax) || 0)/100 + (parseFloat(scannerTip) || 0)/100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillSplitter; 