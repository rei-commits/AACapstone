import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function TallyGo() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [splitType, setSplitType] = useState('equal');
  const [billAmount, setBillAmount] = useState('');
  const [taxPercentage, setTaxPercentage] = useState(8.875); // Default NYC tax
  const [tipPercentage, setTipPercentage] = useState(15);
  const [numPeople, setNumPeople] = useState(1);
  const [items, setItems] = useState([]);
  const [people, setPeople] = useState([
    { name: 'Person 1', items: [] }
  ]);
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  // Calculate totals for equal split
  const calculateEqual = () => {
    const bill = parseFloat(billAmount) || 0;
    const tax = (bill * taxPercentage) / 100;
    const subtotalWithTax = bill + tax;
    const tip = (subtotalWithTax * tipPercentage) / 100;
    const total = subtotalWithTax + tip;
    const perPerson = total / numPeople;
    
    return {
      subtotal: bill.toFixed(2),
      taxAmount: tax.toFixed(2),
      tipAmount: tip.toFixed(2),
      total: total.toFixed(2),
      perPerson: perPerson.toFixed(2)
    };
  };

  // Calculate totals for custom split
  const calculateCustom = () => {
    const itemsTotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const tax = (itemsTotal * taxPercentage) / 100;
    const subtotalWithTax = itemsTotal + tax;
    const tip = (subtotalWithTax * tipPercentage) / 100;
    const total = subtotalWithTax + tip;
    
    // Calculate per person based on their items
    const personTotals = {};
    people.forEach(person => {
      const personItems = items.filter(item => item.assignedTo.includes(person.name));
      const itemsSum = personItems.reduce((sum, item) => {
        const itemAmount = parseFloat(item.amount) || 0;
        const splitAmount = itemAmount / item.assignedTo.length;
        return sum + splitAmount;
      }, 0);
      
      // Add tax and tip proportionally
      const proportion = itemsSum / itemsTotal;
      const personTax = tax * proportion;
      const personTip = tip * proportion;
      
      personTotals[person.name] = {
        items: itemsSum.toFixed(2),
        tax: personTax.toFixed(2),
        tip: personTip.toFixed(2),
        total: (itemsSum + personTax + personTip).toFixed(2)
      };
    });

    return {
      subtotal: itemsTotal.toFixed(2),
      taxAmount: tax.toFixed(2),
      tipAmount: tip.toFixed(2),
      total: total.toFixed(2),
      personTotals
    };
  };

  // Add new person
  const addPerson = () => {
    setPeople([...people, { name: `Person ${people.length + 1}`, items: [] }]);
  };

  // Add new item
  const addItem = () => {
    setItems([...items, {
      name: '',
      amount: '',
      assignedTo: []
    }]);
  };

  // Update item
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Toggle person assignment to item
  const togglePersonAssignment = (itemIndex, personName) => {
    const newItems = [...items];
    const item = newItems[itemIndex];
    
    if (item.assignedTo.includes(personName)) {
      item.assignedTo = item.assignedTo.filter(name => name !== personName);
    } else {
      item.assignedTo.push(personName);
    }
    
    setItems(newItems);
  };

  const results = splitType === 'equal' ? calculateEqual() : calculateCustom();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#14162E]' : 'bg-[#F8F7FA]'}`}>
      {/* Header with theme toggle */}
      <div className={`sticky top-0 z-10 px-4 py-3 flex items-center justify-between border-b ${
        darkMode 
          ? 'bg-[#14162E] border-white/5' 
          : 'bg-[#F8F7FA] border-gray-200'
      }`}>
        <Link to="/" className={`${
          darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}>
          ← Back
        </Link>
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          TallyGo
        </h1>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg ${darkMode ? 'bg-[#2A2C4E]' : 'bg-white'}`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Rest of the TallyGo calculator content */}
      <div className="px-4 py-3">
        {/* Split Type Toggle */}
        <div className={`p-1 rounded-xl flex gap-1 mb-6 ${
          darkMode ? 'bg-[#1F2037]' : 'bg-gray-100'
        }`}>
          <button
            onClick={() => setSplitType('equal')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              splitType === 'equal'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-gray-400'
            }`}
          >
            Equal Split
          </button>
          <button
            onClick={() => setSplitType('custom')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              splitType === 'custom'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-gray-400'
            }`}
          >
            Custom Split
          </button>
        </div>

        {/* Main Content Area - Better spacing */}
        <div className="px-4 pb-safe">
          {splitType === 'equal' ? (
            <div className="bg-[#1F2037] rounded-xl p-4 space-y-5">
              {/* Bill Amount - Cleaner input */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Bill Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full bg-[#2A2C4E] rounded-lg h-12 pl-8 pr-4 text-white text-lg"
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                </div>
              </div>

              {/* Number of People - Better touch targets */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Number of People</label>
                <div className="flex h-12 bg-[#2A2C4E] rounded-lg">
                  <button
                    onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
                    className="w-16 text-xl text-white"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={numPeople}
                    onChange={(e) => setNumPeople(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-transparent text-center text-white text-lg"
                    inputMode="numeric"
                  />
                  <button
                    onClick={() => setNumPeople(numPeople + 1)}
                    className="w-16 text-xl text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tax and Tip Controls */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Tax Percentage</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTaxPercentage(8.875)}
                      className={`py-2 px-4 rounded-lg ${
                        taxPercentage === 8.875
                          ? 'bg-[#8B5CF6] text-white'
                          : 'bg-[#2A2C4E] text-gray-400'
                      }`}
                    >
                      8.875% (NYC)
                    </button>
                    <input
                      type="number"
                      value={taxPercentage}
                      onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
                      className="w-24 bg-[#2A2C4E] rounded-lg py-2 px-3 text-center text-white"
                      placeholder="Custom"
                      inputMode="decimal"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Tip Percentage</label>
                  <div className="flex gap-2">
                    {[15, 18, 20].map((tip) => (
                      <button
                        key={tip}
                        onClick={() => setTipPercentage(tip)}
                        className={`flex-1 py-2 rounded-lg ${
                          tipPercentage === tip
                            ? 'bg-[#8B5CF6] text-white'
                            : 'bg-[#2A2C4E] text-gray-400'
                        }`}
                      >
                        {tip}%
                      </button>
                    ))}
                    <input
                      type="number"
                      value={tipPercentage}
                      onChange={(e) => setTipPercentage(parseInt(e.target.value) || 0)}
                      className="w-20 bg-[#2A2C4E] rounded-lg py-2 px-3 text-center text-white"
                      placeholder="Custom"
                      inputMode="decimal"
                    />
                  </div>
                </div>
              </div>

              {/* Results - Clean layout */}
              <div className="pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${results.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax ({taxPercentage}%)</span>
                  <span className="text-white">${results.taxAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tip ({tipPercentage}%)</span>
                  <span className="text-white">${results.tipAmount}</span>
                </div>
                <div className="pt-3 border-t border-[#353860] flex justify-between">
                  <span className="text-white">Total</span>
                  <span className="text-[#8B5CF6]">${results.total}</span>
                </div>
                <div className="pt-3 border-t border-[#353860] flex justify-between">
                  <span className="text-white">Per Person</span>
                  <span className="text-[#8B5CF6] text-lg font-medium">${results.perPerson}</span>
                </div>
              </div>
            </div>
          ) : (
            // Custom Split UI - Similar mobile-first updates
            <div className="space-y-4">
              {/* People Section */}
              <div className="bg-[#1F2037] rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white">People</h3>
                  <button
                    onClick={addPerson}
                    className="text-[#8B5CF6] text-sm"
                  >
                    + Add Person
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {people.map((person, index) => (
                    <input
                      key={index}
                      type="text"
                      value={person.name}
                      onChange={(e) => {
                        const newPeople = [...people];
                        newPeople[index].name = e.target.value;
                        setPeople(newPeople);
                      }}
                      className="bg-[#2A2C4E] rounded-lg py-2 px-3 text-white text-center"
                      placeholder={`Person ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-[#1F2037] rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white">Items</h3>
                  <button
                    onClick={addItem}
                    className="text-[#8B5CF6] text-sm"
                  >
                    + Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {items.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => updateItem(itemIndex, 'name', e.target.value)}
                          className="flex-1 bg-[#2A2C4E] rounded-lg py-2 px-3 text-white"
                        />
                        <div className="relative w-32">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={item.amount}
                            onChange={(e) => updateItem(itemIndex, 'amount', e.target.value)}
                            className="w-full bg-[#2A2C4E] rounded-lg py-2 pl-8 pr-3 text-white"
                            inputMode="decimal"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {people.map((person, personIndex) => (
                          <button
                            key={personIndex}
                            onClick={() => togglePersonAssignment(itemIndex, person.name)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              item.assignedTo.includes(person.name)
                                ? 'bg-[#8B5CF6] text-white'
                                : 'bg-[#2A2C4E] text-gray-400'
                            }`}
                          >
                            {person.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax and Tip Controls for Custom Split */}
              <div className="bg-[#1F2037] rounded-xl p-4 space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Tax Percentage</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTaxPercentage(8.875)}
                      className={`py-2 px-4 rounded-lg ${
                        taxPercentage === 8.875
                          ? 'bg-[#8B5CF6] text-white'
                          : 'bg-[#2A2C4E] text-gray-400'
                      }`}
                    >
                      8.875% (NYC)
                    </button>
                    <input
                      type="number"
                      value={taxPercentage}
                      onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
                      className="w-24 bg-[#2A2C4E] rounded-lg py-2 px-3 text-center text-white"
                      placeholder="Custom"
                      inputMode="decimal"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Tip Percentage</label>
                  <div className="flex gap-2">
                    {[15, 18, 20].map((tip) => (
                      <button
                        key={tip}
                        onClick={() => setTipPercentage(tip)}
                        className={`flex-1 py-2 rounded-lg ${
                          tipPercentage === tip
                            ? 'bg-[#8B5CF6] text-white'
                            : 'bg-[#2A2C4E] text-gray-400'
                        }`}
                      >
                        {tip}%
                      </button>
                    ))}
                    <input
                      type="number"
                      value={tipPercentage}
                      onChange={(e) => setTipPercentage(parseInt(e.target.value) || 0)}
                      className="w-20 bg-[#2A2C4E] rounded-lg py-2 px-3 text-center text-white"
                      placeholder="Custom"
                      inputMode="decimal"
                    />
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-[#1F2037] rounded-xl p-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${results.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax ({taxPercentage}%)</span>
                  <span className="text-white">${results.taxAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tip ({tipPercentage}%)</span>
                  <span className="text-white">${results.tipAmount}</span>
                </div>
                <div className="pt-3 border-t border-[#353860]">
                  <div className="flex justify-between mb-4">
                    <span className="text-white">Total</span>
                    <span className="text-[#8B5CF6] text-lg font-medium">${results.total}</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(results.personTotals).map(([person, amounts]) => (
                      <div key={person} className="bg-[#2A2C4E] p-3 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-white">{person}</span>
                          <span className="text-[#8B5CF6]">${amounts.total}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Items: ${amounts.items} + Tax: ${amounts.tax} + Tip: ${amounts.tip}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Welcome Alert */}
      <AnimatePresence>
        {showWelcomeAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl shadow-xl bg-gradient-to-b from-[#1F2037] to-[#1A1C3D] border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-4">
                🎉 Ready to Split Some Bills?
              </h3>
              <p className="mb-6 text-gray-300">
                "Friends who split bills together, stay together!" Create an account to save your splits and never forget who owes what! 
              </p>
              <div className="space-y-3">
                <Link 
                  to="/register" 
                  className="block w-full py-3 px-4 bg-[#8B5CF6] text-white rounded-lg text-center font-medium hover:bg-[#7C3AED] transition-colors"
                >
                  Create Free Account
                </Link>
                <button 
                  onClick={() => setShowWelcomeAlert(false)}
                  className="w-full py-3 px-4 bg-[#2A2C4E] text-white rounded-lg font-medium hover:bg-[#353860] transition-colors"
                >
                  Continue as Guest
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl shadow-xl bg-[#1F2037] border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">About TallyGo</h3>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-300 mb-4">
                Split bills, not friendships 🤝 TallyGo is a quick calculator for splitting bills with your friends. 
                No account needed for basic splits, but create one to save your history and manage recurring expenses!
              </p>
              <div className="text-sm text-gray-400">
                Tip: Tax and tip are automatically split proportionally among all participants.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 