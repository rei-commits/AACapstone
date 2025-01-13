import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import GroupPayLogo from '../components/Logo/GroupPayLogo';

/**
 * Login Page Component
 * Handles user authentication and login functionality
 * Features email/password login with validation
 */
const LoginPage = () => {
  // Navigation and form state
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful login
      console.log('Logging in with:', formData);
      
      // Navigate to dashboard on successful login
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <FiArrowLeft />
          Back to home
        </motion.button>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="flex justify-center mb-4"
          >
            <GroupPayLogo className="w-16 h-16" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to continue to GroupPay
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-900 
                           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-900 
                           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                           transition-colors duration-200"
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: showPassword ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </motion.div>
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-1"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 
                       hover:from-indigo-600 hover:to-purple-600
                       text-white font-medium rounded-xl shadow-lg
                       transition-all duration-200"
            >
              Sign In
            </motion.button>
          </form>

          {/* Social Login Options */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 p-2 border border-gray-200 dark:border-gray-700 
                       rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-all duration-200"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              Google
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 p-2 border border-gray-200 dark:border-gray-700 
                       rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-all duration-200"
            >
              <img src="/apple.svg" alt="Apple" className="w-5 h-5" />
              Apple
            </motion.button>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage; 