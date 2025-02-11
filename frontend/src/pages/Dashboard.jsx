import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiUsers, FiDollarSign, FiBell, FiSettings, 
         FiUser, FiCreditCard, FiLogOut, FiX, FiClock, FiTrendingUp, 
         FiPieChart, FiChevronDown } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { updateProfile } from 'firebase/auth';
import CreateGroupModal from '../components/CreateGroupModal';
import { RiRestaurantLine } from 'react-icons/ri';

export default function Dashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [displayNameEdit, setDisplayNameEdit] = useState('');
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [recentActivity] = useState([
    {
      id: 1,
      type: 'restaurant',
      title: 'Dinner at Olive Garden',
      amount: 120.50,
      date: '2 hours ago',
      status: 'pending',
      participants: ['John', 'Sarah', 'Mike']
    },
    {
      id: 2,
      type: 'group_invite',
      title: 'Movie Night',
      inviter: 'Sarah Wilson',
      date: '3 hours ago',
      status: 'pending',
      action: 'join'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      amount: 45.80,
      from: 'Emma',
      date: 'Yesterday',
      status: 'completed'
    }
  ]);

  const [stats] = useState({
    totalOwed: 234.50,
    totalOwing: 115.75,
    pendingSplits: 3,
    mostFrequentGroup: 'Lunch Crew'
  });

  const [friends] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      recentActivity: 'Dinner at Olive Garden',
      owesYou: 40.17,
      youOwe: 0,
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      recentActivity: 'Movie Night',
      owesYou: 25.00,
      youOwe: 0,
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      recentActivity: 'Lunch at Chipotle',
      owesYou: 0,
      youOwe: 15.50,
      status: 'active'
    }
  ]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Good night';
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      } else {
        const displayName = user.displayName || user.email?.split('@')[0] || 'there';
        setUserName(displayName);
        setGreeting(getGreeting());
        setCurrentTime(formatTime());

        const intervalId = setInterval(() => {
          setGreeting(getGreeting());
          setCurrentTime(formatTime());
        }, 60000);

        return () => clearInterval(intervalId);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const quickActions = [
    { 
      icon: <FiUsers />, 
      label: 'Create Group',
      color: 'bg-purple-500', 
      description: 'Create a group to split bills',
      onClick: () => setCreateGroupModalOpen(true)
    },
    { 
      icon: <FiDollarSign />, 
      label: 'Settle Up', 
      color: 'bg-green-500', 
      description: 'Pay or request money',
      onClick: () => {}
    },
    { 
      icon: <FiClock />, 
      label: 'History', 
      color: 'bg-blue-500', 
      description: 'View past splits and payments',
      onClick: () => navigate('/activity')
    },
  ];

  const settingsMenuItems = [
    {
      icon: <FiUser />,
      label: 'Profile',
      description: 'Manage your personal information',
      onClick: () => {}
    },
    {
      icon: <FiCreditCard />,
      label: 'Payment Methods',
      description: 'Add or remove payment options',
      onClick: () => {}
    },
    {
      icon: <FiBell />,
      label: 'Notifications',
      description: 'Configure notification preferences',
      onClick: () => {}
    }
  ];

  const handleUpdateDisplayName = async () => {
    if (!displayNameEdit.trim()) return;
    
    try {
      const updateToast = toast.loading('Updating display name...');
      
      const user = auth.currentUser;
      if (!user) {
        toast.error('You must be logged in to update your name', { id: updateToast });
        return;
      }

      // Using the Firebase Auth updateProfile function
      await updateProfile(user, {
        displayName: displayNameEdit.trim()
      });
      
      // Update local state
      setUserName(displayNameEdit.trim());
      setDisplayNameEdit('');
      setIsSettingsOpen(false);
      
      toast.success('Display name updated successfully!', {
        id: updateToast
      });
    } catch (error) {
      console.error('Error updating display name:', error);
      toast.error(error.message || 'Failed to update display name. Please try again.');
    }
  };

  const handleReceiptUpload = async (file) => {
    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const response = await fetch('http://localhost:8080/api/bills/scan-receipt', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${auth.currentUser.accessToken}`
        }
      });
      
      const data = await response.json();
      setScannedItems(data.items);
    } catch (error) {
      toast.error('Error scanning receipt');
    }
  };

  const handleCreateGroup = async () => {
    try {
      // First create the group
      const groupResponse = await fetch('http://localhost:8080/api/groups', {
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
      const billResponse = await fetch('http://localhost:8080/api/bills', {
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

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'restaurant':
        return <RiRestaurantLine className="w-6 h-6" />;
      case 'group_invite':
        return <FiUsers className="w-6 h-6" />;
      case 'payment':
        return <FiDollarSign className="w-6 h-6" />;
      default:
        return <FiClock className="w-6 h-6" />;
    }
  };

  const ActivityItem = ({ activity }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const renderActivityContent = () => {
      switch (activity.type) {
        case 'restaurant':
          return (
            <>
              <h3 className="font-medium text-white">{activity.title}</h3>
              <p className="text-sm text-gray-400">
                with {activity.participants.join(', ')}
              </p>
            </>
          );
        case 'group_invite':
          return (
            <>
              <h3 className="font-medium text-white">
                {activity.inviter} added you to "{activity.title}"
              </h3>
              <div className="flex gap-2 mt-2">
                <button className="px-3 py-1 bg-purple-500 hover:bg-purple-600 
                                 text-white text-sm rounded-lg transition-colors">
                  Join Group
                </button>
                <button className="px-3 py-1 bg-white/10 hover:bg-white/20 
                                 text-white text-sm rounded-lg transition-colors">
                  Decline
                </button>
              </div>
            </>
          );
        case 'payment':
          return (
            <>
              <h3 className="font-medium text-white">{activity.title}</h3>
              <p className="text-sm text-gray-400">from {activity.from}</p>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="border-b border-white/5 last:border-b-0">
        <motion.div
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
          className="p-4 flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              activity.status === 'pending' 
                ? 'bg-yellow-500/10 text-yellow-400' 
                : 'bg-green-500/10 text-green-400'
            }`}>
              {getActivityIcon(activity.type)}
            </div>
            <div>
              {renderActivityContent()}
              <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
            </div>
          </div>
          {activity.amount && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-white">
                  ${activity.amount.toFixed(2)}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activity.status === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-green-500/10 text-green-400'
                }`}>
                  {activity.status}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="text-gray-400"
              >
                <FiChevronDown className="w-5 h-5" />
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  const FriendsList = ({ friends }) => (
    <div className="bg-[#1A1C2E] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Friends</h2>
        <button className="text-purple-400 hover:text-purple-300 text-sm">
          Add Friend
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4" style={{ minWidth: 'min-content' }}>
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex-shrink-0 w-[200px] bg-[#242642] rounded-xl p-4 hover:bg-[#2A2C4E] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1A1C2E] flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-400">
                    {getInitials(friend.name)}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-medium">{friend.name}</h3>
                  <p className="text-gray-400 text-sm">{friend.recentActivity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SettingsModal = ({ isOpen, onClose, darkMode, userName, onUpdateDisplayName, onSignOut }) => {
    const [displayNameEdit, setDisplayNameEdit] = useState('');

    const settingsMenuItems = [
      {
        icon: <FiUser className="w-5 h-5" />,
        label: 'Profile',
        description: 'Manage your personal information',
        onClick: () => {}
      },
      {
        icon: <FiCreditCard className="w-5 h-5" />,
        label: 'Payment Methods',
        description: 'Add or remove payment options',
        onClick: () => {}
      },
      {
        icon: <FiBell className="w-5 h-5" />,
        label: 'Notifications',
        description: 'Configure notification preferences',
        onClick: () => {}
      }
    ];

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 text-center">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          
          {/* Modal */}
          <div className="inline-block w-full max-w-md my-8 text-left align-middle transition-all transform">
            <div className={`relative rounded-2xl shadow-xl ${darkMode ? 'bg-[#1A1C2E]' : 'bg-white'}`}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-semibold text-white">Settings</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Display Name Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-400">
                    Display Name
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={displayNameEdit}
                      onChange={(e) => setDisplayNameEdit(e.target.value)}
                      placeholder={userName}
                      className="flex-1 px-4 py-2 rounded-lg bg-[#242642] border border-gray-700/50 
                               text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                               focus:ring-purple-500/50"
                    />
                    <button
                      onClick={() => {
                        onUpdateDisplayName(displayNameEdit);
                        setDisplayNameEdit('');
                      }}
                      disabled={!displayNameEdit}
                      className="px-4 py-2 rounded-lg font-medium transition-colors
                               disabled:opacity-50 disabled:cursor-not-allowed
                               bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                  {settingsMenuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="w-full p-4 rounded-xl transition-colors hover:bg-white/5 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 
                                      group-hover:bg-purple-500/20">
                          {item.icon}
                        </div>
                        <div className="text-left">
                          <h4 className="text-white font-medium">{item.label}</h4>
                          <p className="text-sm text-gray-400">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-700/50">
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-red-400 
                           hover:text-red-300 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatsCard = ({ label, value, icon, trend }) => (
    <div className="bg-[#1A1C2E] p-6 rounded-2xl h-full">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-gray-400 text-sm">{label}</p>
          <h3 className="text-2xl font-bold text-white">
            {label === "Pending Splits" ? value : `$${value}`}
          </h3>
        </div>
        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 
                      group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-gray-400 text-sm">vs last month</span>
        </div>
      )}
    </div>
  );

  const GradientCard = ({ children }) => (
    <div className="relative group">
      {/* Animated gradient background */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 
                      rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-1000
                      animate-gradient-xy"></div>
      {/* Card content */}
      <div className="relative bg-[#1A1C2E] p-6 rounded-2xl">
        {children}
      </div>
    </div>
  );

  const SearchBar = () => (
    <div className="relative max-w-2xl">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
        <FiSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search transactions, friends, or groups..."
        className="w-full pl-12 pr-16 py-3 bg-[#242642] rounded-xl
                  border border-gray-700/50 text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
        <kbd className="px-2 py-1 text-xs bg-gray-800 rounded text-gray-400">⌘</kbd>
        <kbd className="px-2 py-1 text-xs bg-gray-800 rounded text-gray-400">K</kbd>
      </div>
    </div>
  );

  const NotificationDropdown = ({ notifications, onClose }) => (
    <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#1A1C2E] shadow-lg 
                    ring-1 ring-white/10 divide-y divide-white/10">
      <div className="p-4">
        <h3 className="text-sm font-medium text-white">Notifications</h3>
      </div>
      <div className="divide-y divide-white/10">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                notification.type === 'payment' 
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-purple-500/10 text-purple-400'
              }`}>
                {notification.type === 'payment' ? <FiDollarSign /> : <FiUsers />}
              </div>
              <div>
                <p className="text-sm text-white">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4">
        <button 
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors w-full text-center"
        >
          View all notifications
        </button>
      </div>
    </div>
  );

  const NotificationBell = () => {
    const [hasNew] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Mock notifications data
    const notifications = [
      {
        id: 1,
        type: 'payment',
        message: 'John Smith paid you $40.17',
        time: '2 minutes ago'
      },
      {
        id: 2,
        type: 'group',
        message: 'Sarah Wilson added you to "Movie Night" group',
        time: '1 hour ago'
      },
      {
        id: 3,
        type: 'payment',
        message: 'You have a pending payment of $25.50',
        time: '2 hours ago'
      }
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FiBell className="w-5 h-5 text-gray-400" />
          {hasNew && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          )}
        </button>

        {/* Notification Dropdown */}
        {isOpen && (
          <NotificationDropdown 
            notifications={notifications}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  };

  const FloatingActionButton = () => (
    <button 
      onClick={() => setCreateGroupModalOpen(true)}
      className="fixed bottom-6 right-6 p-4 rounded-full bg-purple-500 
                hover:bg-purple-600 shadow-lg hover:shadow-xl 
                transition-all group z-50"
    >
      <FiPlus className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
    </button>
  );

  const ActivityFeed = ({ activities }) => (
    <div className="bg-[#1A1C2E] rounded-2xl">
      <div className="p-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        <button 
          onClick={() => navigate('/activity')}
          className="text-purple-400 hover:text-purple-300 text-sm"
        >
          View All
        </button>
      </div>
      <div>
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0C1E]">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-[#0A0C1E]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {greeting}, {userName}
              </h1>
              <p className="text-gray-400">{currentTime}</p>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar />
              <NotificationBell />
              <ThemeToggle />
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <FiSettings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { 
                label: "Total Owed", 
                value: stats.totalOwed.toFixed(2), 
                icon: <FiDollarSign className="w-6 h-6" />, 
                trend: 12 
              },
              { 
                label: "You Owe", 
                value: stats.totalOwing.toFixed(2), 
                icon: <FiTrendingUp className="w-6 h-6" />, 
                trend: -5 
              },
              { 
                label: "Pending Splits", 
                value: stats.pendingSplits,
                icon: <FiUsers className="w-6 h-6" />,
                trend: 0
              },
              { 
                label: "Monthly Spending", 
                value: "1,234.56", 
                icon: <FiPieChart className="w-6 h-6" />, 
                trend: 8 
              }
            ].map((stat) => (
              <GradientCard key={stat.label}>
                <StatsCard {...stat} />
              </GradientCard>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="group p-6 rounded-2xl bg-[#1A1C2E] hover:bg-[#242642] 
                          transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`${action.color} w-14 h-14 rounded-xl flex items-center 
                              justify-center mb-4 bg-opacity-10 
                              group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.label}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </button>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FriendsList friends={friends} />
            </div>
            <div>
              <ActivityFeed activities={recentActivity} />
            </div>
          </div>
        </div>
      </main>

      <FloatingActionButton />
      
      {/* Your existing modals */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        darkMode={darkMode}
        userName={userName}
        onUpdateDisplayName={handleUpdateDisplayName}
        onSignOut={() => auth.signOut()}
      />

      <CreateGroupModal 
        isOpen={isCreateGroupModalOpen}
        onClose={() => setCreateGroupModalOpen(false)}
        onSubmit={handleCreateGroup}
      />
    </div>
  );
} 
