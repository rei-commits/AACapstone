import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { motion } from 'framer-motion';
import { FiPlus, FiUsers, FiDollarSign, FiBell, FiSettings, 
         FiUser, FiCreditCard, FiLogOut, FiTrendingUp, 
         FiPieChart, FiTrash2, FiHome, FiSearch, FiChevronDown, FiUserPlus, FiMoreVertical, FiChevronRight, FiMenu, FiFileText } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { updateProfile } from 'firebase/auth';
import SettingsModal from '../components/SettingsModal';
import NotificationsDropdown from '../components/NotificationsDropdown';
import CreateBillModal from '../components/CreateBillModal';
import FriendsModal from '../components/FriendsModal';
import TimeIllustration from '../components/TimeIllustration';
import SettleUpModal from '../components/SettleUpModal';
import axios from 'axios';
import BillCard from '../components/BillCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [displayNameEdit, setDisplayNameEdit] = useState('');
  const [isCreateBillModalOpen, setIsCreateBillModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [expandedBillId, setExpandedBillId] = useState(null);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [billSearchQuery, setBillSearchQuery] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [isSettleUpModalOpen, setIsSettleUpModalOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [items, setItems] = useState([]);
  const [tax, setTax] = useState(0);
  const [tip, setTip] = useState(0);
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stats] = useState({
    totalOwed: 25.50,    // What others owe you - just from Tiana's bill
    totalOwing: 15.00,   // What you owe others - a small coffee/lunch bill
    pendingSplits: 2,    // A reasonable number of pending splits for a new user
    monthlySpending: 40.50  // Total spending so far - sum of your recent transactions
  });

  const [friendPreviews] = useState([
    { 
      id: 'TM',
      name: 'Tiana',
      owes: 96.90,
      status: 'owes',
      avatarColor: 'from-purple-500 to-blue-500'
    },
    { 
      id: 'CA',
      name: 'Charly',
      avatarColor: 'from-pink-500 to-rose-500'
    },
    { 
      id: 'JR',
      name: 'Jonel',
      owes: 15.00,
      status: 'you_owe',
      avatarColor: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'RP',
      name: 'Raquel',
      avatarColor: 'from-emerald-500 to-teal-500'
    }
  ]);

  const quickActions = [
    { 
      icon: <FiPlus />, 
      label: 'New Split', 
      color: 'bg-purple-500', 
      description: 'Split a new bill',
      onClick: () => setIsCreateBillModalOpen(true)
    },
    { 
      icon: <FiUsers />, 
      label: 'Friends',
      color: 'bg-blue-500', 
      description: 'Manage your friends'
    },
    { 
      icon: <FiDollarSign />, 
      label: 'Settle Up',
      color: 'bg-green-500', 
      description: 'Clear your balances'
    },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log('No user logged in, redirecting to login');
        navigate('/login');
      } else {
        console.log('User logged in:', user.uid);
        setUserName(user.displayName || 'User');
        fetchBills();
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting('Good morning');
        setTimeOfDay('morning');
      } else if (hour < 18) {
        setGreeting('Good afternoon');
        setTimeOfDay('afternoon');
      } else {
        setGreeting('Good evening');
        setTimeOfDay('evening');
      }
    };

    updateGreeting();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTime(timeString);
    };

    // Update time immediately and then every minute
    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBills = async () => {
    try {
      setIsLoading(true);
      console.log('Starting to fetch bills...');
      
      const response = await axios.get('http://localhost:8080/api/bills?userId=1');
      console.log('Raw bills data:', response.data);
      
      if (Array.isArray(response.data)) {
        console.log('Number of bills:', response.data.length);
        console.log('First bill:', response.data[0]);
        setBills(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error details:', error);
      toast.error('Failed to load bills');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Bills state updated:', bills);
  }, [bills]);

  const handleMarkAsPaid = async (billId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/bills/${billId}/pay?uid=${auth.currentUser.uid}`,
        { method: 'POST' }
      );
      if (response.ok) {
        // Refresh bills after marking as paid
        const updatedBills = bills.map(bill => 
          bill.id === billId 
            ? {...bill, participants: bill.participants.map(p => ({...p, paid: true}))}
            : bill
        );
        setBills(updatedBills);
        toast.success('Bill marked as paid!');
      }
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      toast.error('Failed to mark bill as paid');
    }
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/bills/${billId}?uid=${auth.currentUser.uid}`,
          { method: 'DELETE' }
        );
        if (response.ok) {
          setBills(bills.filter(bill => bill.id !== billId));
          toast.success('Bill deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting bill:', error);
        toast.error('Failed to delete bill');
      }
    }
  };

  const filteredBills = bills.filter(bill => 
    bill.name.toLowerCase().includes(billSearchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      if (!items || items.length === 0) {
        toast.error("Please add at least one item to the bill");
        return;
      }

      // Calculate total from items, tax, and tip
      const itemsTotal = items.reduce((sum, item) => 
        sum + (parseFloat(item.price) * (parseInt(item.quantity) || 1)), 0
      );
      const totalAmount = itemsTotal + parseFloat(tax || 0) + parseFloat(tip || 0);

      // Format items
      const formattedItems = items.map(item => ({
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity) || 1
      }));

      // Since you paid physically, you're the payer but not owing
      // Tiana should be the one owing the amount
      const billData = {
        name: "Carmine's",
        items: formattedItems,
        tax: parseFloat(tax) || 0,
        tip: parseFloat(tip) || 0,
        total: totalAmount,
        participantIds: [1, 2], // You (1) and Tiana (2)
        creatorId: 1,  // You
        payerId: 1,    // You paid
        splits: [
          {
            userId: 2,  // Tiana
            amount: totalAmount  // She owes the full amount
          }
        ]
      };

      console.log('Sending bill data:', JSON.stringify(billData, null, 2));
      
      const response = await axios.post('http://localhost:8080/api/bills?userId=1', billData);
      
      if (response.status === 200 || response.status === 201) {
        toast.success('Bill created successfully!');
        setIsCreateBillModalOpen(false);
        // Reset form
        setSelectedFriends([]);
        setItems([]);
        setTax(0);
        setTip(0);
        setTotal(0);
        // Refresh bills
        fetchBills();
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(`Failed to create bill: ${error.response.data.error || 'Unknown error'}`);
      } else {
        toast.error('Failed to create bill. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFriendSelect = (friend) => {
    console.log("Friend selected:", friend);
    if (!friend || !friend.id) {
      console.error("Invalid friend object:", friend);
      return;
    }
    
    setSelectedFriends(prev => {
      // Avoid duplicates
      if (prev.some(f => f.id === friend.id)) {
        return prev;
      }
      return [...prev, friend];
    });
  };

  const markBillAsPaid = async (billId, userId) => {
    try {
      await axios.put(`http://localhost:8080/api/bills/${billId}/participants/${userId}/paid`);
      toast.success('Marked as paid!');
      fetchBills(); // Refresh the bills list
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      toast.error('Failed to mark as paid');
    }
  };

  const deleteBill = async (billId) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8080/api/bills/${billId}?userId=1`);
      toast.success('Bill deleted successfully!');
      fetchBills(); // Refresh the bills list
    } catch (error) {
      console.error('Error deleting bill:', error);
      toast.error('Failed to delete bill');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#13141f]' : 'bg-[#f8f9fc]'}`}>
      {/* Header - Update mobile layout */}
      <header className="sticky top-0 z-10">
        <div className={`backdrop-blur-xl ${darkMode ? 'bg-[#13141f]/80' : 'bg-[#f8f9fc]/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-4 sm:py-0">
              {/* Logo and Search Section */}
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Logo */}
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold">T</span>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                      Tally
                    </h1>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search bills..."
                    value={billSearchQuery}
                    onChange={(e) => setBillSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1a1b2e] border-none 
                      focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                  />
                  <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                  >
                    <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </button>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                    <span className="text-white">{userName.charAt(0)}</span>
                  </div>
                  <span className="hidden sm:inline font-medium">{userName}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600/3 to-blue-500/3 
        border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 
                to-blue-500 bg-clip-text text-transparent">
                {greeting}, {userName}
              </h2>
              <p className="text-gray-500 mt-1">{currentTime}</p>
            </div>
            <TimeIllustration timeOfDay={timeOfDay} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Owed',
              value: stats.totalOwed,
              icon: <FiDollarSign className="w-6 h-6 text-purple-500" />,
              trend: +5,
              gradient: 'from-purple-600 to-indigo-600'
            },
            {
              label: 'You Owe',
              value: stats.totalOwing,
              icon: <FiTrendingUp className="w-6 h-6 text-blue-500" />,
              trend: -3,
              gradient: 'from-blue-600 to-cyan-600'
            },
            {
              label: 'Pending Splits',
              value: stats.pendingSplits,
              icon: <FiUsers className="w-6 h-6 text-emerald-500" />,
              trend: null,
              gradient: 'from-emerald-600 to-teal-600'
            },
            {
              label: 'Monthly Spending',
              value: stats.monthlySpending,
              icon: <FiPieChart className="w-6 h-6 text-rose-500" />,
              trend: +4,
              gradient: 'from-rose-600 to-pink-600'
            }
          ].map((stat) => (
        <motion.div
              key={stat.label}
              className={`relative overflow-hidden ${
                darkMode ? 'bg-[#1a1b2e]' : 'bg-white'
              } rounded-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300`}
              whileHover={{ y: -5 }}
            >
              {/* Gradient Background Accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/3 to-blue-600/3" />
              
              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-10`}>
                    {stat.icon}
                  </div>
                  {stat.trend !== null && (
                    <span className={`text-sm font-medium ${
                      stat.trend > 0 
                        ? 'text-green-500 bg-green-500/10' 
                        : 'text-red-500 bg-red-500/10'
                    } px-2 py-1 rounded-full`}>
                      {stat.trend > 0 ? '+' : ''}{stat.trend}%
                    </span>
                  )}
                </div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat.label}</h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  {stat.label.includes('Splits') ? stat.value : `$${stat.value.toFixed(2)}`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`p-6 rounded-xl ${action.color} bg-opacity-10 hover:bg-opacity-20 
                transition-all group flex items-center justify-between`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center mb-4 shadow-lg`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 
                  bg-clip-text text-transparent mb-2">{action.label}</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{action.description}</p>
            </button>
          ))}
        </div>

        {/* Bills Section */}
        <div className="flex gap-8">
          {/* Main Content - Bills */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Recent Bills
              </h2>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Loading your bills...</p>
              </div>
            ) : bills.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {bills.map((bill) => (
                  <BillCard 
                    key={bill.id} 
                    bill={bill}
                    onMarkAsPaid={markBillAsPaid}
                    onDelete={deleteBill}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiFileText className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  No bills found. Create one to get started!
                </p>
                <button
                  onClick={() => setIsCreateBillModalOpen(true)}
                  className="text-sm text-purple-500 hover:text-purple-600 font-medium"
                >
                  Create New Bill
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar - Friends */}
          <div className="hidden xl:block w-80">
            <div className="bg-white dark:bg-[#1a1b2e] rounded-xl p-5 sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Friends
                </h2>
                <button 
                  onClick={() => setIsFriendsModalOpen(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FiUserPlus className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-2">
                {friendPreviews.map(friend => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-100 
                      dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 p-[2px]">
                          <div className="w-full h-full rounded-[6px] bg-white dark:bg-[#1a1b2e] 
                            flex items-center justify-center">
                            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-500 
                              bg-clip-text text-transparent">
                              {friend.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        {friend.status === 'owes' && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 
                            rounded-full border-2 border-white dark:border-[#1a1b2e]" />
                        )}
                      </div>

                      {/* Name and Balance */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {friend.name.split(' ')[0]}
                        </h3>
                        {friend.owes > 0 && (
                          <p className={friend.status === 'owes' ? 'text-red-400' : 'text-green-400'}>
                            {friend.status === 'owes' 
                              ? `Owes $${friend.owes.toFixed(2)}` 
                              : `You owe $${friend.owes.toFixed(2)}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                      <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <FiDollarSign className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <FiMoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* View All Button */}
                <button
                  onClick={() => setIsFriendsModalOpen(true)}
                  className="w-full p-2 text-sm text-gray-500 hover:text-purple-500 
                    flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  View All Friends
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          setDisplayNameEdit('');
        }}
        darkMode={darkMode}
        userName={userName}
        displayNameEdit={displayNameEdit}
        setDisplayNameEdit={setDisplayNameEdit}
        onUpdateDisplayName={async () => {
          try {
            if (!displayNameEdit.trim()) {
              toast.error('Name cannot be empty');
              return;
            }

            const user = auth.currentUser;
            if (user) {
              await updateProfile(user, {
                displayName: displayNameEdit
              });
              
              // Update all instances of the user name
              setUserName(displayNameEdit);
              
              // Force a re-render of the header
              setGreeting(prev => {
                const hour = new Date().getHours();
                if (hour < 12) return 'Good morning';
                else if (hour < 18) return 'Good afternoon';
                else return 'Good evening';
              });

              toast.success('Profile updated successfully!');
              setIsSettingsOpen(false);
              setDisplayNameEdit('');
            }
          } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
          }
        }}
      />

      <CreateBillModal 
        isOpen={isCreateBillModalOpen}
        onClose={() => {
          setIsCreateBillModalOpen(false);
          setBills([]);
          fetchBills();
        }}
        onBillCreated={handleSubmit}
        selectedFriends={selectedFriends}
        setSelectedFriends={setSelectedFriends}
        items={items}
        setItems={setItems}
        tax={tax}
        setTax={setTax}
        tip={tip}
        setTip={setTip}
        total={total}
        setTotal={setTotal}
      />

      <FriendsModal 
        isOpen={isFriendsModalOpen}
        onClose={() => setIsFriendsModalOpen(false)}
      />

      <SettleUpModal 
        isOpen={isSettleUpModalOpen}
        onClose={() => setIsSettleUpModalOpen(false)}
        friends={friendPreviews}
      />
    </div>
  );
} 
