import React, { useEffect, useState } from 'react';
import { FiSend, FiFileText, FiBell, FiSun, FiMoon, FiSettings, FiLogOut, FiHome, FiActivity, FiPieChart, FiSearch, FiArrowLeft, FiCamera, FiShare2, FiStar, FiClock, FiDollarSign, FiMessageSquare } from 'react-icons/fi';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { groupApi, billApi, userApi } from '../services/api';
import CreateBillModal from '../components/CreateBillModal';
import Request from '../components/Request/Request';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCreateBillModalOpen, setIsCreateBillModalOpen] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [addFriendMethod, setAddFriendMethod] = useState('email');
  const [friendPhone, setFriendPhone] = useState('');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Jonel Rodriguez hasn't paid for Blank Coffee", read: false },
    { id: 2, message: "Tiana Martinez hasn't paid for Burger Queen", read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferStep, setTransferStep] = useState(1);
  const [transferRecipient, setTransferRecipient] = useState(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [transferSearchQuery, setTransferSearchQuery] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showTransferConfirmation, setShowTransferConfirmation] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('balance');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [requestStep, setRequestStep] = useState(1);
  const [requestRecipient, setRequestRecipient] = useState(null);
  const [requestAmount, setRequestAmount] = useState('');
  const [requestNote, setRequestNote] = useState('');
  const [requestSearchQuery, setRequestSearchQuery] = useState('');
  const [requestDueDate, setRequestDueDate] = useState('');
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isInstantWithdraw, setIsInstantWithdraw] = useState(false);

  const calculateBaseFee = (amount) => {
    if (!isInstantWithdraw || !amount) return 0;
    const parsedAmount = parseFloat(amount);
    // Minimum fee of $3.50 for amounts up to $200
    if (parsedAmount <= 200) {
      return 3.50;
    }
    // 0.5% fee for amounts over $200
    return Math.min((parsedAmount * 0.005), 8.00).toFixed(2);
  };

  const calculateServiceFee = (amount) => {
    if (!isInstantWithdraw || !amount) return 0;
    const parsedAmount = parseFloat(amount);
    // Additional $1 service fee for amounts over $1000
    return parsedAmount > 1000 ? 1.00 : 0;
  };

  const calculateFee = (amount) => {
    if (!isInstantWithdraw || !amount) return '0.00';
    const baseFee = parseFloat(calculateBaseFee(amount));
    const serviceFee = calculateServiceFee(amount);
    // Maximum total fee capped at $9.00
    const totalFee = Math.min(baseFee + serviceFee, 9.00);
    return totalFee.toFixed(2);
  };

  const handleSignOut = () => {
    auth.signOut();
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setUserName(parsedUser.fullName?.split(' ')[0] || 'Rei');

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    if (parsedUser && parsedUser.id) {
      fetchUserData(parsedUser.id);
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    setIsLoading(true);
    setError('');
    try {
      const [userBills] = await Promise.all([
        billApi.getUserBills(userId)
      ]);
      
      setBills(Array.isArray(userBills) ? userBills : []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
      setBills([]);
    } finally {
      setIsLoading(false);
    }
  };

  const friends = [
    { initials: 'CA', name: 'Charly Acevedo' },
    { initials: 'JR', name: 'Jonel Rodriguez' },
    { initials: 'TM', name: 'Tiana Martinez' }
  ];

  const handleAddFriend = async (identifier) => {
    try {
      const newFriend = await userApi.addFriend(user.id, {
        type: addFriendMethod,
        value: identifier
      });
      fetchUserData(user.id);
      setShowAddFriendModal(false);
      setFriendEmail('');
      setFriendPhone('');
    } catch (error) {
      console.error('Failed to add friend:', error);
      setError('Failed to add friend. Please try again.');
    }
  };

  useEffect(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModePreference.matches);

    const handler = (e) => setIsDarkMode(e.matches);
    darkModePreference.addEventListener('change', handler);
    return () => darkModePreference.removeEventListener('change', handler);
  }, []);

  // Add filtered results logic
  const getFilteredResults = (query) => {
    const searchTerm = query.toLowerCase();
    
    // Filter transactions
    const filteredTransactions = [
      { 
        id: 1, 
        emoji: '🍔', 
        title: 'Burger Queen',
        participants: ['Tiana Martinez'],
        amount: -24.50,
        date: '2024-01-14'
      },
      { 
        id: 2, 
        emoji: '☕️', 
        title: 'Blank Coffee',
        participants: ['Jonel Rodriguez'],
        amount: -15.80,
        date: '2024-01-13'
      }
    ].filter(transaction => 
      transaction.title.toLowerCase().includes(searchTerm) ||
      transaction.participants.some(p => p.toLowerCase().includes(searchTerm))
    );

    // Filter friends
    const filteredFriends = friends.filter(friend => 
      friend.name.toLowerCase().includes(searchTerm)
    );

    return {
      transactions: filteredTransactions,
      friends: filteredFriends
    };
  };

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
    setShowTransferConfirmation(true);
  };

  const handleConfirmTransfer = () => {
    console.log('Transfer:', {
      recipient: transferRecipient,
      amount: transferAmount,
      note: transferNote
    });
    setShowTransferModal(false);
    resetTransferForm();
  };

  const resetTransferForm = () => {
    setTransferStep(1);
    setTransferRecipient(null);
    setTransferAmount('');
    setTransferNote('');
    setTransferSearchQuery('');
    setShowTransferConfirmation(false);
  };

  const handleShare = () => {
    const paymentLink = `https://grouppay.app/pay/${Math.random().toString(36).substr(2, 9)}`;
    if (navigator.share) {
      navigator.share({
        title: 'GroupPay Transfer',
        text: `Transfer money to me using GroupPay`,
        url: paymentLink
      });
    }
  };

  const handleRequest = () => {
    console.log('Request:', {
      recipient: requestRecipient,
      amount: requestAmount,
      note: requestNote
    });
    setShowRequestModal(false);
    resetRequestForm();
  };

  const resetRequestForm = () => {
    setRequestStep(1);
    setRequestRecipient(null);
    setRequestAmount('');
    setRequestNote('');
    setRequestSearchQuery('');
    setShowRequestModal(false);
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-[#13131A] text-white' 
        : 'bg-[#F8F9FB] text-gray-700'
    } p-4 pb-24 transition-colors duration-200`}>
      {/* Header Section - Always keep gradient */}
      <div className="flex justify-between items-start p-6 bg-gradient-to-r from-[#4B0082] via-[#800080] to-[#9400D3] rounded-2xl mb-6 shadow-lg">
        <div className="flex items-center justify-between w-full">
          <div className="relative group">
            <div className="cursor-pointer">
              <h1 className="text-2xl font-light mb-1 text-white/90">{greeting},</h1>
              <h2 className="text-3xl font-semibold text-white group-hover:opacity-80 transition-opacity">
                rei.acee
              </h2>
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#2D2D3D] rounded-xl shadow-lg py-2 z-50 
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button 
                onClick={() => navigate('/settings')}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-white hover:bg-[#3D3D4D] transition-colors"
              >
                <FiSettings className="w-4 h-4" />
                Account Settings
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-[#3D3D4D] transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSearchModal(true)}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <FiSearch className="w-6 h-6 text-white" />
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? <FiSun className="w-6 h-6 text-white" /> : <FiMoon className="w-6 h-6" />}
            </button>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors relative"
            >
              <FiBell className="w-6 h-6 text-white" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
              
              {/* Notifications Preview Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-[#2D2D3D] rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNotifications(false);
                          setShowNotificationsModal(true);
                        }}
                        className="text-sm text-purple-400 hover:text-purple-300"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 3).map((notification, index) => (
                        <div 
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-[#3D3D4D] cursor-pointer ${!notification.read ? 'bg-purple-500/10' : ''}`}
                        >
                          <p className={`text-sm ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-400 mt-1">2 hours ago</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-400">
                        No new notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Balance Section */}
      <div className={`mb-6 p-6 rounded-2xl ${
        isDarkMode 
          ? 'bg-gradient-to-br from-[#1C1C28] via-[#282833] to-[#1C1C28] border border-purple-500/10 shadow-xl shadow-purple-500/5'
          : 'bg-gradient-to-br from-white via-purple-50/30 to-white border border-purple-100/50 shadow-xl shadow-purple-100/20'
      }`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Available Balance</p>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 bg-clip-text text-transparent">
              $84.32
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-green-400">+1.2%</span>
              <span className="text-xs text-gray-400">from last month</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowWithdrawModal(true)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 transform hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-[#2D2D3D] to-[#1C1C28] text-white border border-purple-500/10 hover:shadow-lg hover:shadow-purple-500/10'
                  : 'bg-gradient-to-r from-gray-50 to-white text-gray-700 border border-purple-100/50 hover:shadow-lg hover:shadow-purple-100/30'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDarkMode
                  ? 'bg-gradient-to-br from-[#3D3D4D] to-[#2D2D3D]'
                  : 'bg-gradient-to-br from-purple-50 to-white'
              }`}>
                <span role="img" aria-label="withdraw" className="text-lg">💳</span>
              </div>
              <span className="font-medium">Withdraw</span>
            </button>
            <button 
              onClick={() => setShowAddMoneyModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white font-medium
                hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center gap-3 transform hover:scale-105"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <span role="img" aria-label="add money" className="text-lg">💰</span>
              </div>
              <span>Add Money</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {/* Transfer */}
        <button 
          onClick={() => setShowTransferModal(true)}
          className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 transform hover:scale-105 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-[#1C1C28] via-[#282833] to-[#1C1C28] hover:shadow-lg hover:shadow-purple-500/10 border border-purple-500/10'
              : 'bg-gradient-to-br from-white via-purple-50/30 to-white hover:shadow-lg hover:shadow-purple-100/30 border border-purple-100/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-1 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-[#2D2D3D] to-[#1C1C28] shadow-inner shadow-purple-500/10'
              : 'bg-gradient-to-br from-purple-50 to-white shadow-inner shadow-purple-100/20'
          }`}>
            <span role="img" aria-label="transfer" className="text-xl">💸</span>
          </div>
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            Transfer
          </span>
        </button>

        {/* Request */}
        <button 
          onClick={() => setShowRequestModal(true)}
          className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 transform hover:scale-105 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-[#1C1C28] via-[#282833] to-[#1C1C28] hover:shadow-lg hover:shadow-purple-500/10 border border-purple-500/10'
              : 'bg-gradient-to-br from-white via-purple-50/30 to-white hover:shadow-lg hover:shadow-purple-100/30 border border-purple-100/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-1 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-[#2D2D3D] to-[#1C1C28] shadow-inner shadow-purple-500/10'
              : 'bg-gradient-to-br from-purple-50 to-white shadow-inner shadow-purple-100/20'
          }`}>
            <span role="img" aria-label="request" className="text-xl">💰</span>
          </div>
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            Request
          </span>
        </button>

        {/* Split Bill */}
        <button 
          onClick={() => setIsCreateBillModalOpen(true)}
          className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 transform hover:scale-105 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-[#1C1C28] via-[#282833] to-[#1C1C28] hover:shadow-lg hover:shadow-purple-500/10 border border-purple-500/10'
              : 'bg-gradient-to-br from-white via-purple-50/30 to-white hover:shadow-lg hover:shadow-purple-100/30 border border-purple-100/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-1 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-[#2D2D3D] to-[#1C1C28] shadow-inner shadow-purple-500/10'
              : 'bg-gradient-to-br from-purple-50 to-white shadow-inner shadow-purple-100/20'
          }`}>
            <FiFileText className="w-5 h-5 text-purple-500" />
          </div>
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            Split Bill
          </span>
        </button>

        {/* More... */}
        <button 
          onClick={() => setShowMoreModal(true)}
          className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 transform hover:scale-105 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-[#1C1C28] via-[#282833] to-[#1C1C28] hover:shadow-lg hover:shadow-purple-500/10 border border-purple-500/10'
              : 'bg-gradient-to-br from-white via-purple-50/30 to-white hover:shadow-lg hover:shadow-purple-100/30 border border-purple-100/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-1 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-[#2D2D3D] to-[#1C1C28] shadow-inner shadow-purple-500/10'
              : 'bg-gradient-to-br from-purple-50 to-white shadow-inner shadow-purple-100/20'
          }`}>
            <span className="text-2xl text-purple-500">...</span>
          </div>
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            More...
          </span>
        </button>
      </div>

      {/* Friends Section */}
      <div className="mb-6">
        <h3 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <span>Friends</span>
          <span className="text-sm bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent font-normal">
            ({friends.length})
          </span>
        </h3>
        <div className="flex gap-4">
          {friends.map((friend, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-2 
                transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                <span className="font-semibold text-lg text-white">{friend.initials}</span>
              </div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'} group-hover:text-purple-600 transition-colors`}>
                {friend.name.split(' ')[0]}
              </span>
              <span className="text-xs text-gray-400">
                {friend.name.split(' ')[1]}
              </span>
            </div>
          ))}
          <button 
            onClick={() => setShowAddFriendModal(true)}
            className="flex flex-col items-center group"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 
              border-2 border-dashed border-purple-500/20 hover:border-purple-500 
              transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-purple-500/10 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-[#1C1C28] via-[#282833] to-[#1C1C28]'
                  : 'bg-gradient-to-br from-white via-purple-50/30 to-white'
              }`}>
              <span className="text-2xl text-purple-500 group-hover:text-purple-600">+</span>
            </div>
            <span className="text-sm text-purple-500 group-hover:text-purple-600">Add Friend</span>
          </button>
        </div>
      </div>

      {/* Recent Group Activity */}
      <div>
        <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
          Recent Group Activity
        </h3>
        <div className="space-y-6">
          {[
            { 
              id: 1, 
              emoji: '🍔', 
              title: 'Burger Queen', 
              amount: -24.50, 
              date: '2024-01-14', 
              participants: [
                { name: 'Charly Acevedo', amount: -12.25, status: 'PAID', isMember: true },
                { name: 'Tiana Martinez', amount: -12.25, status: 'PENDING', isMember: true }
              ],
              total: 24.50,
              tax: 2.00,
              tip: 3.50,
              completionPercentage: 50
            },
            { 
              id: 2, 
              emoji: '☕️', 
              title: 'Blank Coffee', 
              amount: -15.80, 
              date: '2024-01-13', 
              participants: [
                { name: 'Rei Acevedo', amount: -7.90, status: 'PAID', isMember: true },
                { name: 'Jonel Rodriguez', amount: -7.90, status: 'PAID', isMember: true }
              ],
              total: 15.80,
              tax: 1.30,
              tip: 2.50,
              completionPercentage: 100
            },
            { 
              id: 3, 
              emoji: '🍕', 
              title: 'Pizza Night', 
              amount: -45.00, 
              date: '2024-01-15', 
              participants: [
                { name: 'Rei Acevedo', amount: -22.50, status: 'PAID', isMember: true },
                { name: 'Reina', amount: -22.50, status: 'PENDING', isMember: false, inviteCode: 'PIZZA15' }
              ],
              total: 45.00,
              tax: 3.50,
              tip: 5.00,
              completionPercentage: 50
            }
          ].map((activity, index) => (
            <div 
              key={index} 
              onClick={() => {
                setSelectedTransaction(activity);
                setShowTransactionModal(true);
              }}
              className={`p-6 rounded-2xl transition-all duration-200 cursor-pointer ${
                isDarkMode 
                  ? 'bg-gradient-to-b from-[#1C1C28] to-[#282833] hover:shadow-lg hover:shadow-purple-500/5'
                  : 'bg-white/90 hover:shadow-md hover:shadow-purple-100/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span role="img" aria-label={activity.title} className="text-2xl">
                    {activity.emoji}
                  </span>
                  <div>
                    <span className="font-medium">{activity.title}</span>
                    <p className="text-sm text-gray-400">
                      with {activity.participants.map(p => (
                        <span key={p.name}>
                          {p.name}
                          {!p.isMember && (
                            <span className="ml-1 text-xs text-purple-400">(invited)</span>
                          )}
                          {activity.participants.indexOf(p) < activity.participants.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${activity.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {activity.amount > 0 ? '+' : ''}{activity.amount.toFixed(2)}
                </span>
              </div>
              
              {/* Payment Progress Bar */}
              <div className="flex items-center gap-3">
                <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-[#1C1C28]' : 'bg-gray-100'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-500"
                    style={{ width: `${activity.completionPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-purple-500">
                  {activity.completionPercentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 backdrop-blur-lg border-t ${
        isDarkMode 
          ? 'bg-gradient-to-t from-[#13131A] to-[#1C1C28] border-purple-500/10'
          : 'bg-white/80 border-gray-100 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-around items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 text-purple-400"
          >
            <FiHome className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => navigate('/activity')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <FiActivity className="w-6 h-6" />
            <span className="text-xs">Activity</span>
          </button>
          <button 
            onClick={() => navigate('/stats')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <FiPieChart className="w-6 h-6" />
            <span className="text-xs">Stats</span>
          </button>
        </div>
      </div>

      <CreateBillModal 
        isOpen={isCreateBillModalOpen}
        onClose={() => setIsCreateBillModalOpen(false)}
      />

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowAddFriendModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2D2D3D] p-6 rounded-2xl z-50 w-96">
            <h3 className="text-xl font-semibold mb-4">Add Friend</h3>
            
            {/* Toggle buttons */}
            <div className="flex bg-[#1C1C28] rounded-xl p-1 mb-4">
              <button
                onClick={() => setAddFriendMethod('email')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                  ${addFriendMethod === 'email' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'}`}
              >
                Email
              </button>
              <button
                onClick={() => setAddFriendMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                  ${addFriendMethod === 'phone' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'}`}
              >
                Phone
              </button>
            </div>

            {addFriendMethod === 'email' ? (
              <input
                type="email"
                placeholder="Enter friend's email"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                className="w-full bg-[#1C1C28] text-white p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <input
                type="tel"
                placeholder="Enter friend's phone number"
                value={friendPhone}
                onChange={(e) => setFriendPhone(e.target.value)}
                className="w-full bg-[#1C1C28] text-white p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddFriendModal(false);
                  setFriendEmail('');
                  setFriendPhone('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddFriend(addFriendMethod === 'email' ? friendEmail : friendPhone)}
                className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
              >
                Add Friend
              </button>
            </div>
          </div>
        </>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowWithdrawModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-[#2D2D3D] to-[#1C1C28] p-6 rounded-2xl z-50 w-[480px] border border-purple-500/10 shadow-xl shadow-purple-500/10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <span role="img" aria-label="withdraw" className="text-xl">💳</span>
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Withdraw Money</h3>
              </div>
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Quick Amount Selection */}
              <div className="bg-[#1C1C28] rounded-xl p-4 border border-purple-500/5">
                <label className="text-sm text-gray-400 mb-4 block">Quick Amount</label>
                <div className="grid grid-cols-4 gap-3">
                  {[10, 20, 50, 100].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        amount === quickAmount.toString()
                          ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-500/20'
                          : 'bg-[#2D2D3D] text-gray-300 hover:bg-[#3D3D4D] border border-purple-500/10'
                      }`}
                    >
                      ${quickAmount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div className="bg-[#1C1C28] rounded-xl p-4 border border-purple-500/5">
                <label className="text-sm text-gray-400 mb-4 block">Custom Amount</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                    <span className="text-2xl bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent font-semibold">$</span>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#2D2D3D] text-white pl-10 p-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/10 text-xl font-semibold"
                  />
                </div>
              </div>
              
              {/* Bank Account Selection */}
              <div className="bg-[#1C1C28] rounded-xl p-4 border border-purple-500/5">
                <label className="text-sm text-gray-400 mb-4 block">Select Bank Account</label>
                <div className="space-y-3">
                  <button className="w-full p-3 rounded-xl bg-[#2D2D3D] hover:bg-[#3D3D4D] transition-all duration-300 flex items-center justify-between group border border-purple-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3D3D4D] to-[#2D2D3D] flex items-center justify-center">
                        <span role="img" aria-label="bank" className="text-xl">🏦</span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium group-hover:text-purple-400 transition-colors">Bank of America</div>
                        <div className="text-sm text-gray-400">Checking **** 1234</div>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-purple-500 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    </div>
                  </button>

                  <button className="w-full p-3 rounded-xl bg-[#2D2D3D] hover:bg-[#3D3D4D] transition-all duration-300 flex items-center justify-between group border border-purple-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3D3D4D] to-[#2D2D3D] flex items-center justify-center">
                        <span role="img" aria-label="bank" className="text-xl">🏦</span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium group-hover:text-purple-400 transition-colors">Chase Bank</div>
                        <div className="text-sm text-gray-400">Savings **** 5678</div>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                  </button>

                  <button 
                    onClick={() => {
                      setShowWithdrawModal(false);
                      navigate('/settings');
                    }}
                    className="w-full p-3 rounded-xl bg-[#2D2D3D] hover:bg-[#3D3D4D] transition-all duration-300 flex items-center gap-3 group border border-purple-500/10"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3D3D4D] to-[#2D2D3D] flex items-center justify-center">
                      <span className="text-xl text-purple-500 group-hover:text-purple-400">+</span>
                    </div>
                    <span className="font-medium text-purple-500 group-hover:text-purple-400">Add New Bank Account</span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#1C1C28] rounded-xl p-4 border border-purple-500/5">
                <h4 className="text-sm text-gray-400 mb-4">Withdrawal Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount</span>
                    <span>${parseFloat(amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Processing Time</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsInstantWithdraw(false)}
                        className={`px-3 py-1 rounded-lg text-xs transition-all ${
                          !isInstantWithdraw
                            ? 'bg-purple-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        1-3 Business Days
                      </button>
                      <button
                        onClick={() => setIsInstantWithdraw(true)}
                        className={`px-3 py-1 rounded-lg text-xs transition-all flex items-center gap-1 ${
                          isInstantWithdraw
                            ? 'bg-purple-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Instant
                        <div className="group relative">
                          <span className="text-xs ml-1 cursor-help">ⓘ</span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-[#3D3D4D] rounded-lg text-xs text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            Instant withdrawals are processed immediately with the following fees:
                            <ul className="mt-1 list-disc list-inside">
                              <li>$3.50 flat fee up to $200</li>
                              <li>0.5% fee for amounts over $200</li>
                              <li>$1 service fee over $1,000</li>
                              <li>Maximum fee: $9.00</li>
                            </ul>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm relative">
                    <span className="text-gray-400">Fee</span>
                    <div className="flex items-center gap-2">
                      <span>${calculateFee(amount)}</span>
                      {isInstantWithdraw && (
                        <div className="group relative">
                          <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
                          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#3D3D4D] rounded-lg text-xs text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            Fee breakdown:
                            <div className="mt-1 space-y-1">
                              <div className="flex justify-between">
                                <span>Base fee:</span>
                                <span>${calculateBaseFee(amount)}</span>
                              </div>
                              {calculateServiceFee(amount) > 0 && (
                                <div className="flex justify-between">
                                  <span>Service fee:</span>
                                  <span>${calculateServiceFee(amount)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${(parseFloat(amount || 0) + parseFloat(calculateFee(amount))).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setAmount('');
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-700 hover:bg-[#3D3D4D] transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement withdraw functionality
                  setShowWithdrawModal(false);
                  setAmount('');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium
                  hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105"
              >
                Withdraw ${(parseFloat(amount || 0) + parseFloat(calculateFee(amount))).toFixed(2)}
                {isInstantWithdraw && <span className="block text-sm text-white/80">Instant Delivery</span>}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowAddMoneyModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-[#2D2D3D] to-[#1C1C28] p-6 rounded-2xl z-50 w-[480px] border border-purple-500/10 shadow-xl shadow-purple-500/10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <span role="img" aria-label="add money" className="text-xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Add Money</h3>
              </div>
              <button 
                onClick={() => setShowAddMoneyModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Quick Amount Selection */}
              <div className="bg-[#1C1C28] rounded-xl p-4 border border-purple-500/5">
                <label className="text-sm text-gray-400 mb-4 block">Quick Amount</label>
                <div className="grid grid-cols-4 gap-3">
                  {[10, 20, 50, 100].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        amount === quickAmount.toString()
                          ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-500/20'
                          : 'bg-[#2D2D3D] text-gray-300 hover:bg-[#3D3D4D] border border-purple-500/10'
                      }`}
                    >
                      ${quickAmount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div className="bg-[#1C1C28] rounded-xl p-4 border border-purple-500/5">
                <label className="text-sm text-gray-400 mb-4 block">Custom Amount</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                    <span className="text-2xl bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent font-semibold">$</span>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#2D2D3D] text-white pl-10 p-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/10 text-xl font-semibold"
                  />
                </div>
              </div>
              
              {/* Payment Method Selection */}
              <div className="bg-[#1C1C28] rounded-xl p-4 border border-purple-500/5">
                <label className="text-sm text-gray-400 mb-4 block">Payment Method</label>
                <div className="space-y-3">
                  <button className="w-full p-3 rounded-xl bg-[#2D2D3D] hover:bg-[#3D3D4D] transition-all duration-300 flex items-center justify-between group border border-purple-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3D3D4D] to-[#2D2D3D] flex items-center justify-center">
                        <span role="img" aria-label="card" className="text-xl">💳</span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium group-hover:text-purple-400 transition-colors">Visa ending in 1234</div>
                        <div className="text-sm text-gray-400">Debit Card</div>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-purple-500 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    </div>
                  </button>

                  <button className="w-full p-3 rounded-xl bg-[#2D2D3D] hover:bg-[#3D3D4D] transition-all duration-300 flex items-center justify-between group border border-purple-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3D3D4D] to-[#2D2D3D] flex items-center justify-center">
                        <span role="img" aria-label="bank" className="text-xl">🏦</span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium group-hover:text-purple-400 transition-colors">Bank Transfer</div>
                        <div className="text-sm text-gray-400">Direct Deposit</div>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                  </button>

                  <button 
                    onClick={() => {
                      setShowAddMoneyModal(false);
                      navigate('/settings');
                    }}
                    className="w-full p-3 rounded-xl bg-[#2D2D3D] hover:bg-[#3D3D4D] transition-all duration-300 flex items-center gap-3 group border border-purple-500/10"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3D3D4D] to-[#2D2D3D] flex items-center justify-center">
                      <span className="text-xl text-purple-500 group-hover:text-purple-400">+</span>
                    </div>
                    <span className="font-medium text-purple-500 group-hover:text-purple-400">Add New Payment Method</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowAddMoneyModal(false);
                  setAmount('');
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-700 hover:bg-[#3D3D4D] transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement add money functionality
                  setShowAddMoneyModal(false);
                  setAmount('');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium
                  hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105"
              >
                Add ${parseFloat(amount || 0).toFixed(2)}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSearchModal(false)}
          />
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-[#2D2D3D] p-6 rounded-2xl z-50 w-[600px]">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions, friends, or groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1C1C28] text-white pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                autoFocus
              />
            </div>

            <div className="mt-4 max-h-[400px] overflow-y-auto">
              {searchQuery && (
                <div className="space-y-4">
                  {/* Recent Transactions */}
                  {getFilteredResults(searchQuery).transactions.length > 0 && (
                    <div>
                      <h4 className="text-sm text-gray-400 mb-2">Recent Transactions</h4>
                      <div className="space-y-2">
                        {getFilteredResults(searchQuery).transactions.map((transaction, index) => (
                          <div 
                            key={index} 
                            className="bg-[#1C1C28] p-3 rounded-xl hover:bg-[#282833] transition-colors cursor-pointer flex items-center justify-between"
                            onClick={() => {
                              const fullTransaction = [
                                { id: 1, emoji: '🍔', title: 'Burger Queen', amount: -24.50, date: '2024-01-14', 
                                  participants: [
                                    { name: 'Charly Acevedo', amount: -12.25, status: 'PAID' },
                                    { name: 'Tiana Martinez', amount: -12.25, status: 'PENDING' }
                                  ],
                                  total: 24.50, tax: 2.00, tip: 3.50, completionPercentage: 50
                                },
                                { id: 2, emoji: '☕️', title: 'Blank Coffee', amount: -15.80, date: '2024-01-13', 
                                  participants: [
                                    { name: 'Rei Acevedo', amount: -7.90, status: 'PAID' },
                                    { name: 'Jonel Rodriguez', amount: -7.90, status: 'PAID' }
                                  ],
                                  total: 15.80, tax: 1.30, tip: 2.50, completionPercentage: 100
                                }
                              ].find(t => t.id === transaction.id);
                              setSelectedTransaction(fullTransaction);
                              setShowTransactionModal(true);
                              setShowSearchModal(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{transaction.emoji}</span>
                              <div>
                                <div className="font-medium">{transaction.title}</div>
                                <div className="text-sm text-gray-400">with {transaction.participants.join(', ')}</div>
                              </div>
                            </div>
                            <span className={`font-medium ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Friends */}
                  {getFilteredResults(searchQuery).friends.length > 0 && (
                    <div>
                      <h4 className="text-sm text-gray-400 mb-2">Friends</h4>
                      <div className="space-y-2">
                        {getFilteredResults(searchQuery).friends.map((friend, index) => (
                          <div 
                            key={index} 
                            className="bg-[#1C1C28] p-3 rounded-xl hover:bg-[#282833] transition-colors cursor-pointer flex items-center gap-3"
                            onClick={() => {
                              // TODO: Navigate to friend profile or open friend details
                              setShowSearchModal(false);
                            }}
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] rounded-xl flex items-center justify-center">
                              <span className="font-medium text-white">{friend.initials}</span>
                            </div>
                            <span className="font-medium">{friend.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {getFilteredResults(searchQuery).transactions.length === 0 &&
                   getFilteredResults(searchQuery).friends.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && selectedTransaction && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowTransactionModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2D2D3D] p-6 rounded-2xl z-50 w-[480px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedTransaction.emoji}</span>
                <div>
                  <h3 className="text-xl font-semibold">{selectedTransaction.title}</h3>
                  <p className="text-sm text-gray-400">{selectedTransaction.date}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTransactionModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Bill Details */}
            <div className="bg-[#1C1C28] p-4 rounded-xl mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${(selectedTransaction.total - selectedTransaction.tax - selectedTransaction.tip).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span>${selectedTransaction.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tip</span>
                  <span>${selectedTransaction.tip.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${selectedTransaction.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Split Details */}
            <div>
              <h4 className="text-sm text-gray-400 mb-3">Split Details</h4>
              <div className="space-y-3">
                {selectedTransaction.participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {participant.name === user?.fullName ? 'You' : participant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          {participant.name === user?.fullName ? 'You' : participant.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${participant.status === 'PAID' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {participant.status}
                          </span>
                          {participant.status === 'PENDING' && !participant.isMember && (
                            <span className="text-xs text-purple-400">(invited)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">${Math.abs(participant.amount).toFixed(2)}</span>
                      {participant.status === 'PENDING' && participant.name !== user?.fullName && (
                        <button 
                          className="p-2 bg-[#3D3D4D] text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 group relative"
                          title="Send payment reminder"
                        >
                          <FiBell className="w-4 h-4" />
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#3D3D4D] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Send reminder
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Payment Progress</span>
                <span className="text-sm font-medium text-purple-400">
                  {selectedTransaction.completionPercentage}% Complete
                </span>
              </div>
              <div className="h-1.5 bg-[#1C1C28] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-500"
                  style={{ width: `${selectedTransaction.completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setShowTransferModal(false);
              resetTransferForm();
            }}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2D2D3D] p-6 rounded-2xl z-50 w-[480px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (transferStep === 2) {
                      setTransferStep(1);
                    } else {
                      setShowTransferModal(false);
                      resetTransferForm();
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-[#3D3D4D] transition-colors"
                >
                  <FiArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold">Transfer Money</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowQRScanner(true)}
                  className="p-2 rounded-lg hover:bg-[#3D3D4D] transition-colors"
                >
                  <FiCamera className="w-6 h-6" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg hover:bg-[#3D3D4D] transition-colors"
                >
                  <FiShare2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {transferStep === 1 && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={transferSearchQuery}
                    onChange={(e) => setTransferSearchQuery(e.target.value)}
                    placeholder="Search contacts..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1C1C28] border border-gray-700 focus:border-purple-500 outline-none"
                  />
                </div>

                {/* Frequent Recipients */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiStar className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-medium text-gray-400">
                      Frequent Recipients
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {frequentContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => {
                          setTransferRecipient(contact);
                          setTransferStep(2);
                        }}
                        className="p-3 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all text-left"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] flex items-center justify-center text-white font-medium">
                            {contact.avatar}
                          </div>
                          <div>
                            <h4 className="font-medium">{contact.name}</h4>
                            <p className="text-xs text-gray-400">
                              {contact.frequency}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Contacts */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-400">
                      Recent Contacts
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {recentContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => {
                          setTransferRecipient(contact);
                          setTransferStep(2);
                        }}
                        className="w-full p-3 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] flex items-center justify-center text-white font-medium">
                          {contact.avatar}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-medium">{contact.name}</h4>
                          <p className="text-sm text-gray-400">
                            Last transfer: {contact.lastTransfer}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {transferStep === 2 && (
              <div className="space-y-6">
                {/* Recipient Info */}
                <div className="bg-[#1C1C28] rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] flex items-center justify-center text-white font-medium">
                    {transferRecipient?.avatar}
                  </div>
                  <div>
                    <h3 className="font-medium">{transferRecipient?.name}</h3>
                    <p className="text-sm text-gray-400">Last transfer: {transferRecipient?.lastTransfer}</p>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Select Payment Method</label>
                  <div className="space-y-2">
                    <button 
                      className="w-full p-3 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-colors flex items-center justify-between"
                      onClick={() => setSelectedPaymentMethod('balance')}
                    >
                      <div className="flex items-center gap-3">
                        <span role="img" aria-label="wallet" className="text-xl">👛</span>
                        <div className="text-left">
                          <div className="font-medium">Available Balance</div>
                          <div className="text-sm text-gray-400">$84.32 available</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border ${selectedPaymentMethod === 'balance' ? 'bg-purple-500 border-purple-500' : 'border-gray-600'}`}></div>
                    </button>

                    <button 
                      className="w-full p-3 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-colors flex items-center justify-between"
                      onClick={() => setSelectedPaymentMethod('card')}
                    >
                      <div className="flex items-center gap-3">
                        <span role="img" aria-label="card" className="text-xl">💳</span>
                        <div className="text-left">
                          <div className="font-medium">Visa ending in 1234</div>
                          <div className="text-sm text-gray-400">Expires 12/24</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border ${selectedPaymentMethod === 'card' ? 'bg-purple-500 border-purple-500' : 'border-gray-600'}`}></div>
                    </button>

                    <button 
                      className="w-full p-3 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-colors flex items-center justify-between"
                      onClick={() => setSelectedPaymentMethod('bank')}
                    >
                      <div className="flex items-center gap-3">
                        <span role="img" aria-label="bank" className="text-xl">🏦</span>
                        <div className="text-left">
                          <div className="font-medium">Bank of America</div>
                          <div className="text-sm text-gray-400">Checking ****5678</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border ${selectedPaymentMethod === 'bank' ? 'bg-purple-500 border-purple-500' : 'border-gray-600'}`}></div>
                    </button>

                    <button 
                      className="w-full p-3 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-colors flex items-center justify-between text-purple-500"
                      onClick={() => setShowAddPaymentModal(true)}
                    >
                      <div className="flex items-center gap-3">
                        <span role="img" aria-label="add" className="text-xl">➕</span>
                        <span className="font-medium">Add New Payment Method</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={() => setTransferStep(3)}
                  disabled={!selectedPaymentMethod}
                  className="w-full py-3 px-4 rounded-xl bg-purple-500 text-white font-medium
                    hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {transferStep === 3 && (
              <div className="space-y-6">
                {/* Quick Amount Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Quick Amount</label>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setTransferAmount(amount.toString())}
                        className={`p-2 rounded-xl border text-center transition-colors ${
                          transferAmount === amount.toString()
                            ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                            : 'border-gray-700 hover:border-purple-500 hover:bg-purple-500/20'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount and Note */}
                <div className="bg-[#1C1C28] rounded-xl p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#282833] border border-gray-700 focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Add a note</label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        value={transferNote}
                        onChange={(e) => setTransferNote(e.target.value)}
                        placeholder="What's this for?"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#282833] border border-gray-700 focus:border-purple-500 outline-none min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-[#1C1C28] rounded-xl p-4">
                  <h4 className="text-sm font-medium mb-3">Transfer Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Amount</span>
                      <span>${parseFloat(transferAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Payment Method</span>
                      <span>{
                        selectedPaymentMethod === 'balance' ? 'Available Balance' :
                        selectedPaymentMethod === 'card' ? 'Visa ****1234' :
                        'Bank ****5678'
                      }</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Fee</span>
                      <span>$0.00</span>
                    </div>
                    <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>${parseFloat(transferAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Transfer Button */}
                <button
                  onClick={handleTransfer}
                  disabled={!transferAmount || parseFloat(transferAmount) <= 0}
                  className="w-full py-3 px-4 rounded-xl bg-purple-500 text-white font-medium
                    hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Transfer ${parseFloat(transferAmount || 0).toFixed(2)}
                </button>
              </div>
            )}

            {/* Confirmation Modal */}
            {showTransferConfirmation && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-[#2D2D3D] rounded-xl p-6 max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-4">Confirm Transfer</h3>
                  
                  <div className="bg-[#1C1C28] rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] flex items-center justify-center text-white font-medium">
                        {transferRecipient?.avatar}
                      </div>
                      <div>
                        <h4 className="font-medium">{transferRecipient?.name}</h4>
                        <p className="text-sm text-gray-400">Transfer Details</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Amount</span>
                        <span>${parseFloat(transferAmount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Fee</span>
                        <span>$0.00</span>
                      </div>
                      {transferNote && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Note</span>
                          <span className="text-right">{transferNote}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${parseFloat(transferAmount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowTransferConfirmation(false)}
                      className="flex-1 py-2 px-4 rounded-xl border border-gray-700 hover:bg-[#3D3D4D] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmTransfer}
                      className="flex-1 py-2 px-4 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setShowRequestModal(false);
              resetRequestForm();
            }}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2D2D3D] p-6 rounded-2xl z-50 w-[480px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (requestStep === 2) {
                      setRequestStep(1);
                    } else {
                      setShowRequestModal(false);
                      resetRequestForm();
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-[#3D3D4D] transition-colors"
                >
                  <FiArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold">Request Money</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowQRScanner(true)}
                  className="p-2 rounded-lg hover:bg-[#3D3D4D] transition-colors"
                >
                  <FiCamera className="w-6 h-6" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg hover:bg-[#3D3D4D] transition-colors"
                >
                  <FiShare2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {requestStep === 1 && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={requestSearchQuery}
                    onChange={(e) => setRequestSearchQuery(e.target.value)}
                    placeholder="Search contacts..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1C1C28] border border-gray-700 focus:border-purple-500 outline-none"
                  />
                </div>

                {/* Frequent Recipients */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiStar className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-medium text-gray-400">
                      Frequent Contacts
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {frequentContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => {
                          setRequestRecipient(contact);
                          setRequestStep(2);
                        }}
                        className="p-3 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] flex items-center justify-center text-white font-medium">
                            {contact.avatar}
                          </div>
                          <div>
                            <h4 className="font-medium">{contact.name}</h4>
                            <p className="text-xs text-gray-400">
                              {contact.frequency}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Contacts */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-400">
                      Recent Contacts
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {recentContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => {
                          setRequestRecipient(contact);
                          setRequestStep(2);
                        }}
                        className="w-full p-3 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] flex items-center justify-center text-white font-medium">
                          {contact.avatar}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-medium">{contact.name}</h4>
                          <p className="text-sm text-gray-400">
                            Last request: {contact.lastTransfer}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {requestStep === 2 && (
              <div className="space-y-6">
                {/* Recipient Info */}
                <div className="bg-[#1C1C28] rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] flex items-center justify-center text-white font-medium">
                    {requestRecipient?.avatar}
                  </div>
                  <div>
                    <h3 className="font-medium">{requestRecipient?.name}</h3>
                    <p className="text-sm text-gray-400">Last request: {requestRecipient?.lastTransfer}</p>
                  </div>
                </div>

                {/* Amount and Note */}
                <div className="bg-[#1C1C28] rounded-xl p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={requestAmount}
                        onChange={(e) => setRequestAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#282833] border border-gray-700 focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Add a note</label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        value={requestNote}
                        onChange={(e) => setRequestNote(e.target.value)}
                        placeholder="What's this for?"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#282833] border border-gray-700 focus:border-purple-500 outline-none min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Due Date */}
                <div className="bg-[#1C1C28] rounded-xl p-4">
                  <label className="block text-sm font-medium mb-2">Due Date (Optional)</label>
                  <input
                    type="date"
                    value={requestDueDate}
                    onChange={(e) => setRequestDueDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#282833] border border-gray-700 focus:border-purple-500 outline-none"
                  />
                </div>

                {/* Request Button */}
                <button
                  onClick={handleRequest}
                  disabled={!requestAmount || parseFloat(requestAmount) <= 0}
                  className="w-full py-3 px-4 rounded-xl bg-purple-500 text-white font-medium
                    hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Request ${parseFloat(requestAmount || 0).toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* More Actions Modal */}
      {showMoreModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMoreModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2D2D3D] p-6 rounded-2xl z-50 w-[480px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">More Actions</h3>
              <button 
                onClick={() => setShowMoreModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Settings */}
              <button 
                onClick={() => {
                  setShowMoreModal(false);
                  setShowSettingsModal(true);
                }}
                className="p-4 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all text-left flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] flex items-center justify-center">
                  <FiSettings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Settings</h4>
                  <p className="text-sm text-gray-400">Account preferences</p>
                </div>
              </button>

              {/* Payment Methods */}
              <button 
                onClick={() => {
                  setShowMoreModal(false);
                  navigate('/settings');
                }}
                className="p-4 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all text-left flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] flex items-center justify-center">
                  <span role="img" aria-label="card" className="text-lg">💳</span>
                </div>
                <div>
                  <h4 className="font-medium">Payment Methods</h4>
                  <p className="text-sm text-gray-400">Manage cards & banks</p>
                </div>
              </button>

              {/* Notifications */}
              <button 
                onClick={() => {
                  setShowMoreModal(false);
                  setShowNotifications(true);
                }}
                className="p-4 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all text-left flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] flex items-center justify-center">
                  <FiBell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Notifications</h4>
                  <p className="text-sm text-gray-400">View all notifications</p>
                </div>
              </button>

              {/* Help & Support */}
              <button 
                onClick={() => {
                  setShowMoreModal(false);
                  setShowHelpModal(true);
                }}
                className="p-4 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all text-left flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6E3AFA] to-[#8B5CF6] flex items-center justify-center">
                  <span role="img" aria-label="help" className="text-lg">❓</span>
                </div>
                <div>
                  <h4 className="font-medium">Help & Support</h4>
                  <p className="text-sm text-gray-400">Get assistance</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSettingsModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2D2D3D] p-6 rounded-2xl z-50 w-[480px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Settings</h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Profile Settings */}
              <div className="p-4 rounded-xl bg-[#1C1C28]">
                <h4 className="font-medium mb-2">Profile</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Full Name</label>
                    <input 
                      type="text" 
                      value={user?.fullName || ''}
                      className="w-full mt-1 p-2 rounded-lg bg-[#282833] border border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <input 
                      type="email" 
                      value={user?.email || ''}
                      className="w-full mt-1 p-2 rounded-lg bg-[#282833] border border-gray-700"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="p-4 rounded-xl bg-[#1C1C28]">
                <h4 className="font-medium mb-2">Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dark Mode</span>
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="p-2 rounded-lg hover:bg-[#282833]"
                    >
                      {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push Notifications</span>
                    <div className="w-12 h-6 bg-purple-500 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowHelpModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2D2D3D] p-6 rounded-2xl z-50 w-[480px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Help & Support</h3>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <button className="w-full p-4 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all text-left flex items-center justify-between">
                <span>FAQs</span>
                <FiArrowLeft className="w-5 h-5 rotate-180" />
              </button>
              <button className="w-full p-4 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all text-left flex items-center justify-between">
                <span>Contact Support</span>
                <FiArrowLeft className="w-5 h-5 rotate-180" />
              </button>
              <button className="w-full p-4 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all text-left flex items-center justify-between">
                <span>Report an Issue</span>
                <FiArrowLeft className="w-5 h-5 rotate-180" />
              </button>
              <button className="w-full p-4 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all text-left flex items-center justify-between">
                <span>Privacy Policy</span>
                <FiArrowLeft className="w-5 h-5 rotate-180" />
              </button>
              <button className="w-full p-4 rounded-xl bg-[#1C1C28] hover:bg-[#282833] transition-all text-left flex items-center justify-between">
                <span>Terms of Service</span>
                <FiArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowNotificationsModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2D2D3D] p-6 rounded-2xl z-50 w-[480px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">Notifications</h3>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {notifications.filter(n => !n.read).length} new
                  </span>
                )}
              </div>
              <button 
                onClick={() => setShowNotificationsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-xl ${
                    !notification.read 
                      ? 'bg-[#1C1C28] border border-purple-500/20' 
                      : 'bg-[#1C1C28]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                        {notification.message}
                      </p>
                      <span className="text-sm text-gray-400">2 hours ago</span>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No notifications yet
                </div>
              )}
            </div>

            {notifications.filter(n => !n.read).length > 0 && (
              <button
                onClick={() => {
                  setNotifications(notifications.map(n => ({ ...n, read: true })));
                }}
                className="w-full mt-4 py-2 px-4 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage; 