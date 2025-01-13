import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GroupPayLogo from '../components/Logo/GroupPayLogo';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

/**
 * Landing Page Component
 * Main marketing page for the application
 * Features animated sections and call-to-action buttons
 */
const LandingPage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const accentColor = '#8B5CF6'; // Indigo color
  const bgLight = 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200';
  const bgDark = 'bg-gradient-to-br from-[#0A0A20] via-[#1A1A3A] to-[#0A0A20]';

  const activities = [
    { 
      emoji: "🍕", 
      title: "Pizza Night", 
      amount: "-$24.50",
      participants: [
        { name: "Alex", amount: "$8.17", paid: true },
        { name: "Jamie", amount: "$8.17", paid: true },
        { name: "Sam", amount: "$8.16", paid: false }
      ],
      status: "2/3 Paid"
    },
    { 
      emoji: "🎳", 
      title: "Bowling", 
      amount: "-$32.00",
      participants: [
        { name: "Alex", amount: "$8.00", paid: true },
        { name: "Jamie", amount: "$8.00", paid: false },
        { name: "Sam", amount: "$8.00", paid: true },
        { name: "Taylor", amount: "$8.00", paid: false }
      ],
      status: "2/4 Paid"
    },
    { 
      emoji: "🏠", 
      title: "Rent Split", 
      amount: "+$750.00",
      participants: [
        { name: "Alex", amount: "$250.00", paid: true },
        { name: "Jamie", amount: "$250.00", paid: true },
        { name: "Sam", amount: "$250.00", paid: true }
      ],
      status: "Completed"
    }
  ];

  const handleInstaSplitClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleContinueWithoutAccount = () => {
    setShowModal(false);
    navigate('/instasplit');
  };

  return (
    <div className={`relative ${darkMode ? bgDark : bgLight}`}>
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-[#1A1A3A]' : 'bg-white'}`}
            >
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Want to Save Your Splits?
              </h3>
              <p className={`mb-6 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                Create an account to save your split history and access additional features. Or continue without an account for quick calculations.
              </p>
              <div className="space-y-3">
                <Link
                  to="/signup"
                  className={`block w-full py-3 px-4 text-center rounded-xl font-medium transition-colors ${darkMode ? 'bg-[#8B5CF6] hover:bg-[#7C3AED]' : 'bg-[#6D28D9] hover:bg-[#5B21B6]'} text-white`}
                >
                  Create Account
                </Link>
                <button
                  onClick={handleContinueWithoutAccount}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                >
                  Continue Without Account
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className={`w-full py-2 text-sm transition-colors ${darkMode ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <span className={`font-medium text-xl ${darkMode ? 'text-[#8B5CF6]' : 'text-[#6D28D9]'}`}>
                GroupPay
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={handleInstaSplitClick}
                className={`${darkMode ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                InstaSplit
              </button>
              <Link
                to="/login"
                className={`${darkMode ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className={`px-4 py-2 ${darkMode ? 'bg-[#8B5CF6] hover:bg-[#7C3AED]' : 'bg-[#6D28D9] hover:bg-[#5B21B6]'} text-white rounded-lg transition-colors`}
              >
                Get Started
              </Link>
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg focus:outline-none"
            >
              <div className={`w-6 h-0.5 mb-1.5 transition-all ${darkMode ? 'bg-white' : 'bg-gray-900'} ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 mb-1.5 transition-all ${darkMode ? 'bg-white' : 'bg-gray-900'} ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 transition-all ${darkMode ? 'bg-white' : 'bg-gray-900'} ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="flex-1 pt-8 lg:pt-12 text-center lg:text-left">
              <motion.h1 
                className={`text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Split Bills,<br />
                <span className={darkMode ? 'text-[#8B5CF6]' : 'text-[#6D28D9]'}>
                  Not Friendships
                </span>
              </motion.h1>

              <motion.p 
                className={`text-lg sm:text-xl mb-8 lg:mb-12 max-w-xl mx-auto lg:mx-0 ${darkMode ? 'text-white/80' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                The smart way to split bills, track expenses, and settle up instantly with your friends.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <Link
                  to="/signup"
                  className={`px-8 py-4 ${darkMode ? 'bg-[#8B5CF6] hover:bg-[#7C3AED]' : 'bg-[#6D28D9] hover:bg-[#5B21B6]'} text-white rounded-xl font-medium transition-colors w-full sm:w-auto text-center`}
                >
                  Get Started Free
                </Link>
                <button
                  onClick={handleInstaSplitClick}
                  className={`px-8 py-4 ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-900/5 hover:bg-gray-900/10'} ${darkMode ? 'text-white' : 'text-gray-900'} rounded-xl font-medium transition-colors w-full sm:w-auto text-center`}
                >
                  Try InstaSplit
                </button>
              </motion.div>
            </div>

            {/* Right Content - App Preview */}
            <div className="flex-1 relative w-full max-w-[280px] mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative"
              >
                {/* Phone Frame */}
                <div className="relative">
                  <div className="relative w-full">
                    {/* Phone Notch */}
                    <div className="absolute top-0 inset-x-0 h-5 bg-black rounded-t-3xl z-30">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#1A1A2E] rounded-full"></div>
                    </div>
                    
                    {/* Phone Frame Border */}
                    <div className="absolute -inset-2 bg-black rounded-[2.5rem] z-10"></div>
                    
                    {/* Power Button */}
                    <div className="absolute -right-2 top-16 w-0.5 h-10 bg-black rounded-r-lg z-20"></div>
                    
                    {/* Volume Buttons */}
                    <div className="absolute -left-2 top-16 w-0.5 h-6 bg-black rounded-l-lg z-20"></div>
                    <div className="absolute -left-2 top-24 w-0.5 h-6 bg-black rounded-l-lg z-20"></div>

                    {/* Screen Content */}
                    <div className={`relative rounded-[2rem] shadow-2xl overflow-hidden bg-[#1A1A2E] p-4 z-20`}>
                      <div className="aspect-[9/19] w-full">
                        {/* Status Bar */}
                        <div className="h-6"></div>

                        {/* App Content with proper spacing */}
                        <div className="pt-4">
                          {/* App Header */}
                          <div className="mb-6">
                            <div className="flex flex-col">
                              <div className="text-white text-lg font-medium mb-1">Hey there! 👋</div>
                              <div className="text-gray-400 text-sm">Available Balance</div>
                              <div className="text-[#8B5CF6] text-2xl font-semibold">$420.69</div>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="grid grid-cols-2 gap-3 mb-6">
                            <motion.div 
                              whileHover={{ scale: 1.02 }}
                              className="p-3 rounded-2xl bg-[#252540] cursor-pointer"
                            >
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 flex items-center justify-center mb-1">
                                  <span className="text-xl">💸</span>
                                </div>
                                <div className="text-xs font-medium text-white">Send Money</div>
                              </div>
                            </motion.div>
                            <motion.div 
                              whileHover={{ scale: 1.02 }}
                              className="p-3 rounded-2xl bg-[#252540] cursor-pointer"
                            >
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 flex items-center justify-center mb-1">
                                  <span className="text-xl">🧾</span>
                                </div>
                                <div className="text-xs font-medium text-white">Split Bill</div>
                              </div>
                            </motion.div>
                          </div>

                          {/* Recent Activity */}
                          <div>
                            <div className="text-white text-sm font-medium mb-3">Recent Activity</div>
                            <div className="space-y-2">
                              {activities.map((activity, index) => (
                                <div key={index}>
                                  <motion.div 
                                    whileHover={{ scale: 1.01 }}
                                    className="flex items-center justify-between p-3 rounded-xl bg-[#252540] cursor-pointer"
                                    onClick={() => setSelectedActivity(selectedActivity?.title === activity.title ? null : activity)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-[#2A2A45] flex items-center justify-center">
                                        <span className="text-base">{activity.emoji}</span>
                                      </div>
                                      <span className="text-sm font-medium text-white">{activity.title}</span>
                                    </div>
                                    <span className={`text-sm font-medium ${activity.amount.startsWith('+') ? 'text-green-400' : 'text-white'}`}>
                                      {activity.amount}
                                    </span>
                                  </motion.div>
                                  
                                  {/* Dropdown Preview */}
                                  <AnimatePresence>
                                    {selectedActivity?.title === activity.title && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="mt-2 p-3 rounded-xl bg-[#252540]/50 backdrop-blur-sm">
                                          <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-400">Status</span>
                                            <span className="text-xs font-medium text-amber-400">{activity.status}</span>
                                          </div>
                                          <div className="space-y-2">
                                            {activity.participants.map((participant, idx) => (
                                              <div key={idx} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <div className={`w-1.5 h-1.5 rounded-full ${participant.paid ? 'bg-green-400' : 'bg-gray-500'}`} />
                                                  <span className="text-xs text-white">{participant.name}</span>
                                                </div>
                                                <span className="text-xs font-medium text-white">{participant.amount}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Friends Section */}
                          <div className="mt-6">
                            <div className="text-white text-sm font-medium mb-3">Friends</div>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                              {[
                                { initials: "AS", name: "Alex" },
                                { initials: "JD", name: "Jamie" },
                                { initials: "SK", name: "Sam" },
                                { initials: "+", name: "Add" }
                              ].map((friend, index) => (
                                <motion.div
                                  key={index}
                                  whileHover={{ scale: 1.05 }}
                                  className="flex flex-col items-center min-w-[60px]"
                                >
                                  <div className="w-12 h-12 rounded-xl bg-[#252540] flex items-center justify-center text-white text-sm font-medium mb-1">
                                    {friend.initials}
                                  </div>
                                  <span className="text-xs text-gray-400">{friend.name}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Home Bar */}
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Shadow */}
                  <div className="absolute -bottom-6 inset-x-4 h-[20px] bg-black/20 blur-xl rounded-full z-0"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 lg:py-32 px-4 sm:px-6 ${darkMode ? 'bg-black/20' : 'bg-white/40'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Try InstaSplit
            </h2>
            <p className={`text-lg lg:text-xl max-w-3xl mx-auto mb-8 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
              Need to split a bill quickly? Use InstaSplit to divide expenses without creating an account. Perfect for one-time splits with friends, family, or colleagues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleInstaSplitClick}
                className={`px-8 py-4 rounded-xl font-medium text-white transition-colors ${darkMode ? 'bg-[#8B5CF6] hover:bg-[#7C3AED]' : 'bg-[#6D28D9] hover:bg-[#5B21B6]'}`}
              >
                Try InstaSplit Now
              </motion.button>
              <p className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                No account required
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Quick & Easy",
                description: "Split bills in seconds with a simple, intuitive interface",
                icon: "⚡️"
              },
              {
                title: "No Sign Up",
                description: "Start splitting immediately - no account creation needed",
                icon: "🎯"
              },
              {
                title: "Share Instantly",
                description: "Send split details to everyone via SMS or email",
                icon: "📱"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-900/5 hover:bg-gray-900/10'} backdrop-blur-sm rounded-2xl p-6 lg:p-8 transition-colors`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`text-lg lg:text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm lg:text-base ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 lg:py-32 px-4 sm:px-6 ${darkMode ? 'bg-black/20' : 'bg-white/40'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-20"
          >
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Split Bills Like Never Before
            </h2>
            <p className={`text-lg lg:text-xl ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
              Experience the future of expense sharing
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Quick Split",
                description: "Split any bill instantly without creating an account",
                icon: "⚡️"
              },
              {
                title: "Smart Groups",
                description: "Create groups for trips, roommates, or regular hangouts",
                icon: ""
              },
              {
                title: "Easy Settlement",
                description: "Settle debts with a single tap using multiple payment methods",
                icon: "💸"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-900/5 hover:bg-gray-900/10'} backdrop-blur-sm rounded-2xl p-6 lg:p-8 transition-colors`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`text-lg lg:text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm lg:text-base ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;