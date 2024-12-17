import React, { useState } from 'react';
import { FiDollarSign, FiCheck, FiClock, FiArrowLeft, FiFilter, FiCalendar, FiCreditCard, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const QuickSettle = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all', 'you_owe', 'they_owe'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [settlements] = useState([
    {
      id: 1,
      person: 'Sarah',
      amount: 25.50,
      type: 'they_owe',
      description: 'Pizza Night',
      date: '2024-01-20',
      group: 'Weekend Hangout'
    },
    {
      id: 2,
      person: 'Mike',
      amount: 15.00,
      type: 'you_owe',
      description: 'Movie Night',
      date: '2024-01-22',
      group: 'Movie Club'
    }
  ]);

  const [groupHistory] = useState([
    {
      groupId: '1',
      groupName: 'Weekend Hangout',
      emoji: '🎉',
      status: 'ended',
      endedAt: '2024-01-22',
      totalSpent: 165.50,
      members: ['You', 'Sarah', 'John'],
      transactions: [
        {
          id: 1,
          date: '2024-01-20',
          eventName: 'Friday Pizza Night',
          paidBy: 'You',
          totalAmount: 75.50,
          items: [
            { name: 'Large Pizza', price: 30.00 },
            { name: 'Wings', price: 30.00 },
            { name: 'Drinks', price: 15.50 }
          ],
          splits: [
            {
              person: 'Sarah',
              amount: 25.50,
              settledDate: '2024-01-22',
              paymentMethod: 'Venmo',
              status: 'settled'
            },
            {
              person: 'John',
              amount: 25.00,
              settledDate: '2024-01-21',
              paymentMethod: 'PayPal',
              status: 'settled'
            }
          ]
        },
        {
          id: 2,
          date: '2024-01-21',
          eventName: 'Saturday Movie Night',
          paidBy: 'John',
          totalAmount: 90.00,
          items: [
            { name: 'Movie tickets (3)', price: 45.00 },
            { name: 'Popcorn', price: 30.00 },
            { name: 'Drinks', price: 15.00 }
          ],
          splits: [
            {
              person: 'You',
              amount: 30.00,
              settledDate: '2024-01-21',
              paymentMethod: 'Cash',
              status: 'settled'
            },
            {
              person: 'Sarah',
              amount: 30.00,
              settledDate: '2024-01-21',
              paymentMethod: 'Cash',
              status: 'settled'
            }
          ]
        }
      ]
    }
  ]);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showHistoryDetails, setShowHistoryDetails] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedTransactions, setExpandedTransactions] = useState({});

  const handlePayment = (debt) => {
    setSelectedDebt(debt);
    setShowPaymentModal(true);
  };

  const filteredSettlements = settlements.filter(debt => {
    if (filter === 'all') return true;
    return debt.type === filter;
  });

  const handleViewSettlement = (group, settlement) => {
    if (!group || !settlement) return;
    setSelectedGroup(group);
    setSelectedSettlement(settlement);
    setShowHistoryDetails(true);
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const toggleTransaction = (transactionId) => {
    setExpandedTransactions(prev => ({
      ...prev,
      [transactionId]: !prev[transactionId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="fixed top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Quick Settle</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-sm text-green-600 mb-1">You are owed</h3>
            <p className="text-2xl font-bold text-green-700">$25.50</p>
            <p className="text-sm text-green-600">From 1 person</p>
          </div>
          <div className="bg-red-50 p-6 rounded-xl border border-red-100">
            <h3 className="text-sm text-red-600 mb-1">You owe</h3>
            <p className="text-2xl font-bold text-red-700">$15.00</p>
            <p className="text-sm text-red-600">To 1 person</p>
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('they_owe')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'they_owe'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Owed to You
          </button>
          <button
            onClick={() => setFilter('you_owe')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'you_owe'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            You Owe
          </button>
        </div>

        {/* Active Settlements */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Active Settlements</h2>
          <div className="space-y-4">
            {filteredSettlements.map(debt => (
              <div 
                key={debt.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  debt.type === 'they_owe' 
                    ? 'border-green-100 bg-green-50' 
                    : 'border-red-100 bg-red-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    debt.type === 'they_owe' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <FiDollarSign className={`w-5 h-5 ${
                      debt.type === 'they_owe' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{debt.person}</p>
                    <p className="text-sm text-gray-500">{debt.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <FiCalendar className="w-3 h-3" />
                      {debt.date}
                      <span>•</span>
                      {debt.group}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className={`font-bold ${
                    debt.type === 'they_owe' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {debt.type === 'they_owe' ? '+' : '-'}${debt.amount.toFixed(2)}
                  </p>
                  <button
                    onClick={() => debt.type === 'you_owe' ? handlePayment(debt) : null}
                    className={`px-4 py-1 rounded-full text-sm flex items-center gap-1 ${
                      debt.type === 'they_owe'
                        ? 'text-green-600 border border-green-600 hover:bg-green-50'
                        : 'text-red-600 border border-red-600 hover:bg-red-50'
                    }`}
                  >
                    {debt.type === 'they_owe' ? (
                      <>
                        <FiClock className="w-4 h-4" />
                        Send Reminder
                      </>
                    ) : (
                      <>
                        <FiCreditCard className="w-4 h-4" />
                        Pay Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settlement History by Groups */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Group History</h2>
          
          <div className="space-y-3">
            {groupHistory.map(group => (
              <div key={group.groupId} className="border rounded-xl overflow-hidden">
                {/* Group Header - Clickable */}
                <button
                  onClick={() => toggleGroup(group.groupId)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{group.emoji}</span>
                    <div className="text-left">
                      <h3 className="text-lg font-medium">{group.groupName}</h3>
                      <p className="text-sm text-gray-500">
                        Total spent: ${group.totalSpent.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm text-gray-500">
                      <div>Ended {group.endedAt}</div>
                      <div>{group.members.length} members</div>
                    </div>
                    {expandedGroups[group.groupId] ? 
                      <FiChevronDown className="w-5 h-5 text-gray-400" /> : 
                      <FiChevronRight className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                </button>

                {/* Group Transactions */}
                {expandedGroups[group.groupId] && (
                  <div className="border-t divide-y">
                    {group.transactions.map(transaction => (
                      <div key={transaction.id} className="bg-gray-50">
                        {/* Transaction Header - Clickable */}
                        <button
                          onClick={() => toggleTransaction(transaction.id)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <h4 className="font-medium text-left">{transaction.eventName}</h4>
                            <p className="text-sm text-gray-500 text-left">
                              Paid by {transaction.paidBy} • ${transaction.totalAmount.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">{transaction.date}</span>
                            {expandedTransactions[transaction.id] ? 
                              <FiChevronDown className="w-5 h-5 text-gray-400" /> : 
                              <FiChevronRight className="w-5 h-5 text-gray-400" />
                            }
                          </div>
                        </button>

                        {/* Transaction Details */}
                        {expandedTransactions[transaction.id] && (
                          <div className="px-4 pb-3 space-y-3">
                            {/* Items */}
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-sm font-medium mb-2">Items</p>
                              <div className="space-y-1">
                                {transaction.items.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>{item.name}</span>
                                    <span>${item.price.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Split Details */}
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-sm font-medium mb-2">Split Details</p>
                              <div className="space-y-2">
                                {transaction.splits.map((split, index) => (
                                  <div key={index} className="flex justify-between items-center text-sm">
                                    <div>
                                      <span>{split.person}</span>
                                      <span className="text-gray-500 ml-2">
                                        via {split.paymentMethod}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span>${split.amount.toFixed(2)}</span>
                                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                        Settled {split.settledDate}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedDebt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Pay ${selectedDebt.amount?.toFixed(2) || '0.00'}
            </h2>
            <p className="text-gray-600 mb-4">to {selectedDebt.person}</p>
            
            {/* Payment Methods */}
            <div className="space-y-2 mb-6">
              <button className="w-full p-3 border rounded-lg flex items-center gap-3 hover:bg-gray-50">
                <img src="/venmo-icon.png" alt="Venmo" className="w-6 h-6" />
                Pay with Venmo
              </button>
              <button className="w-full p-3 border rounded-lg flex items-center gap-3 hover:bg-gray-50">
                <img src="/paypal-icon.png" alt="PayPal" className="w-6 h-6" />
                Pay with PayPal
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle payment confirmation
                  setShowPaymentModal(false);
                }}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settlement Details Modal */}
      {showHistoryDetails && selectedSettlement && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedGroup.groupName}</h2>
                <p className="text-gray-600">{selectedSettlement.description}</p>
              </div>
              <button 
                onClick={() => setShowHistoryDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold">
                    ${selectedSettlement.amount?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Paid by</span>
                  <span className="font-medium">{selectedSettlement.person}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span>{selectedSettlement.paymentMethod}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Items</h3>
                <ul className="bg-gray-50 rounded-lg divide-y">
                  {selectedSettlement.items.map((item, index) => (
                    <li key={index} className="px-4 py-2 text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedSettlement.notes}
                </p>
              </div>

              <div className="text-xs text-gray-400 flex justify-between pt-4 border-t">
                <span>Created: {selectedSettlement.date}</span>
                <span>Settled: {selectedSettlement.settledDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickSettle; 