import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function LandingPage() {
  const { darkMode } = useTheme();
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [activities] = useState([
    { 
      title: '99 Favor Taste Hotpot', 
      emoji: '🍲',
      amount: '-$120.50',
      location: 'Chinatown',
      participants: [
        { name: 'Sophia Rodriguez', amount: '$30.13', percentage: '25%', paid: true },
        { name: 'Marcus Chen', amount: '$30.12', percentage: '25%', paid: false },
        { name: 'Isabella Kim', amount: '$30.13', percentage: '25%', paid: true },
        { name: 'Ethan James', amount: '$30.12', percentage: '25%', paid: false }
      ],
      status: '2/4 Paid'
    },
    { 
      title: "Jacob's Pickles", 
      emoji: '🍗',
      amount: '-$156.00',
      location: 'Upper West Side',
      participants: [
        { name: 'Olivia', amount: '$52.00', percentage: '33.3%', paid: true },
        { name: 'Lucas', amount: '$52.00', percentage: '33.3%', paid: true },
        { name: 'Ava', amount: '$52.00', percentage: '33.3%', paid: false }
      ],
      status: '2/3 Paid'
    },
    { 
      title: 'Space Billiards', 
      emoji: '🎱',
      amount: '-$240.00',
      location: 'K-Town',
      participants: [
        { name: 'Daniel', amount: '$60.00', percentage: '25%', paid: true },
        { name: 'Emma', amount: '$60.00', percentage: '25%', paid: true },
        { name: 'Noah', amount: '$60.00', percentage: '25%', paid: true },
        { name: 'Mia', amount: '$60.00', percentage: '25%', paid: true }
      ],
      status: 'Completed'
    }
  ]);

  const mainBg = darkMode 
    ? 'bg-gradient-to-br from-[#0A0A20] via-[#1A1A3A] to-[#0A0A20]'
    : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200';

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  // Helper function to get initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className={`min-h-screen ${mainBg}`}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <span className="font-medium text-xl text-primary">
                Tally
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              <div className="relative group">
                <Link to="/tallygo" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  TallyGo
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 p-4 bg-white dark:bg-[#1F2037] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">⚡️</span>
                    <span className="font-medium text-gray-900 dark:text-white">TallyGo Mode</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Split bills instantly without an account. Perfect for quick splits with friends!
                  </p>
                </div>
              </div>
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
              >
                Get Started
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-left">
              <motion.div 
                className="text-5xl lg:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.span 
                  className="text-gray-900 dark:text-white block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Split Bills,
                </motion.span>
                <motion.span 
                  className="text-primary relative inline-block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Not Friendships
                  <motion.div 
                    className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </motion.span>
              </motion.div>

              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                The smart way to split bills for dining, events, and group activities. 
                Upload receipts, split in real-time with your group, and keep the good times rolling.
              </motion.p>

              <motion.div 
                className="flex flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <Link to="/signup" className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white">
                  Get Started Free
                </Link>
                <Link 
                  to="/tallygo" 
                  className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white inline-flex items-center gap-2"
                >
                  Try TallyGo
                  <span className="text-primary">⚡️</span>
                </Link>
              </motion.div>
            </div>

            <motion.div 
              className="flex-1 w-full max-w-[380px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {/* Phone frame */}
              <div className="relative mx-auto">
                {/* Phone notch and status bar */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-3xl z-10" />
                
                {/* Main phone content */}
                <div className="rounded-[40px] p-6 bg-gradient-to-b from-gray-50 to-white dark:from-[#1A1A3A] dark:to-[#0A0A20] shadow-2xl border border-gray-200 dark:border-gray-800">
                  <div className="space-y-4 h-[750px] overflow-y-auto">
                    {/* Header with gradient background */}
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 p-4 rounded-2xl backdrop-blur-sm">
                      <p className="text-lg text-gray-900 dark:text-white mb-1 font-medium">Hey there! 👋</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Available Balance</p>
                      <p className="text-3xl font-bold text-[#8B5CF6]">$250.50</p>
                    </div>

                    {/* Action buttons with gradients */}
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/20 dark:to-purple-500/20 text-center hover:from-indigo-500/10 hover:to-purple-500/10 dark:hover:from-indigo-500/30 dark:hover:to-purple-500/30 transition-all duration-300 backdrop-blur-sm">
                        <span className="block text-2xl mb-1">👥</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Create Group</span>
                      </button>
                      <button className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/20 text-center hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 backdrop-blur-sm">
                        <span className="block text-2xl mb-1">🧾</span>
                        <span className="text-sm text-gray-300 font-medium">Add Expense</span>
                      </button>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-2">
                      <p className="text-gray-900 dark:text-white mb-2">Recent Activity</p>
                      <div className="space-y-2">
                        {activities.map((activity, index) => (
                          <div key={index} className="rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 overflow-hidden">
                            <div 
                              className="p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              onClick={() => setExpandedActivity(expandedActivity === index ? null : index)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span role="img" aria-label={activity.title}>{activity.emoji}</span>
                                  <div>
                                    <p className="text-gray-900 dark:text-white font-medium">{activity.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.location}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={activity.amount.includes('+') ? 'text-green-500' : 'text-gray-900 dark:text-white'}>
                                    {activity.amount}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.status}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Dropdown content */}
                            {expandedActivity === index && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="mt-3 space-y-2">
                                  {activity.participants.map((participant, pIndex) => (
                                    <div key={pIndex} className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white text-sm">
                                          {getInitials(participant.name)}
                                        </div>
                                        <div>
                                          <p className="text-gray-900 dark:text-white text-sm">{participant.name.split(' ')[0]}</p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">{participant.percentage}</p>
                                        </div>
                                      </div>
                                      <div className="text-right flex items-center gap-2">
                                        <p className="text-gray-900 dark:text-white text-sm">{participant.amount}</p>
                                        <div className={`w-2 h-2 rounded-full ${participant.paid ? 'bg-green-500' : 'bg-yellow-500'}`} 
                                             title={participant.paid ? 'Paid' : 'Pending'}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Friends section */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-900 dark:text-white">Friends</p>
                        <div className="text-[#8B5CF6] text-sm">Add New</div>
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {[
                          { name: 'Sophia Rodriguez', status: 'online', bgColor: 'bg-indigo-500' },
                          { name: 'Marcus Chen', status: 'away', bgColor: 'bg-purple-500' },
                          { name: 'Isabella Kim', status: 'online', bgColor: 'bg-pink-500' },
                          { name: 'Ethan James', status: 'offline', bgColor: 'bg-blue-500' },
                          { name: 'Olivia Smith', status: 'online', bgColor: 'bg-teal-500' },
                          { name: 'Lucas Parker', status: 'away', bgColor: 'bg-rose-500' },
                          { name: 'Ava Martinez', status: 'offline', bgColor: 'bg-violet-500' },
                          { name: 'Daniel Lee', status: 'online', bgColor: 'bg-cyan-500' }
                        ].map((friend, index) => (
                          <div key={index} className="text-center flex-shrink-0">
                            <div className="relative">
                              <div className={`w-12 h-12 rounded-xl ${friend.bgColor} flex items-center justify-center text-white font-medium shadow-lg`}>
                                {getInitials(friend.name)}
                              </div>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-[#1A1A3A] rounded-full ${
                                friend.status === 'online' ? 'bg-green-400' :
                                friend.status === 'away' ? 'bg-yellow-400' :
                                'bg-gray-400'
                              }`} />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap mt-1">
                              {friend.name.split(' ')[0]}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 sm:py-32 bg-gray-50 dark:bg-[#1A1C3D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Split Bills <span className="text-[#8B5CF6]">Effortlessly</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Experience the future of bill splitting with our powerful features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group"
            >
              <div className="bg-gray-100 dark:bg-[#1F2037] p-8 rounded-2xl hover:bg-[#353860] transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">📱</div>
                <h3 className="text-2xl font-semibold mb-4">Mobile First</h3>
                <p className="text-gray-400 leading-relaxed">
                  Split bills on the go with our intuitive mobile-friendly interface. Access your expenses anywhere, anytime.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group"
            >
              <div className="bg-gray-100 dark:bg-[#1F2037] p-8 rounded-2xl hover:bg-[#353860] transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">🧾</div>
                <h3 className="text-2xl font-semibold mb-4">Receipt Scanning</h3>
                <p className="text-gray-400 leading-relaxed">
                  Simply snap a photo of your receipt and let our AI handle the rest. Automatic item detection and splitting.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group"
            >
              <div className="bg-gray-100 dark:bg-[#1F2037] p-8 rounded-2xl hover:bg-[#353860] transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">👥</div>
                <h3 className="text-2xl font-semibold mb-4">Group Management</h3>
                <p className="text-gray-400 leading-relaxed">
                  Create and manage multiple groups for different occasions. Track expenses and settle up with ease.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 text-center bg-gray-50 dark:bg-[#14162E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-16">
            Split bills in three simple steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-8 rounded-2xl bg-white dark:bg-[#1F2037] hover:bg-gray-100 dark:hover:bg-[#2A2C4E] transition-colors">
              <div className="text-8xl font-bold text-[#8B5CF6]/10 dark:text-[#8B5CF6]/20 absolute -top-10 left-8">1</div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Create a Group</h3>
                <p className="text-gray-600 dark:text-gray-400">Add friends and start tracking expenses together</p>
              </div>
            </div>
            
            <div className="relative p-8 rounded-2xl bg-white dark:bg-[#1F2037] hover:bg-gray-100 dark:hover:bg-[#2A2C4E] transition-colors">
              <div className="text-8xl font-bold text-[#8B5CF6]/10 dark:text-[#8B5CF6]/20 absolute -top-10 left-8">2</div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Add Expenses</h3>
                <p className="text-gray-600 dark:text-gray-400">Upload receipts or manually enter expenses</p>
              </div>
            </div>
            
            <div className="relative p-8 rounded-2xl bg-white dark:bg-[#1F2037] hover:bg-gray-100 dark:hover:bg-[#2A2C4E] transition-colors">
              <div className="text-8xl font-bold text-[#8B5CF6]/10 dark:text-[#8B5CF6]/20 absolute -top-10 left-8">3</div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Settle Up</h3>
                <p className="text-gray-600 dark:text-gray-400">See who owes what and settle up easily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 sm:py-32 bg-white dark:bg-[#1A1C3D] relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center px-4 sm:px-6 relative"
        >
          <span className="inline-block px-4 py-2 bg-purple-500/10 rounded-full text-purple-400 text-sm font-medium mb-6">
            Join Our Community
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
            No More IOU Drama
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl mb-8 sm:mb-12 leading-relaxed">
            Join thousands who split bills without the awkward math.
            Quick, easy, and totally vibe-proof! ✌️
          </p>
          <motion.button
            onClick={() => setShowModal(true)}
            className="bg-[#8B5CF6] px-8 py-4 rounded-xl text-lg font-medium hover:bg-[#7C3AED] transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required • Free plan available
          </p>
        </motion.div>
      </motion.section>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            {/* Copy the modal content here */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add the style tag at the end of your component, before the closing div */}
      <style jsx global>{`
        * {
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
      `}</style>
    </div>
  );
} 