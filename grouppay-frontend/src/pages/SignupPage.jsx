import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowLeft, FiCheck, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import GroupPayLogo from '../components/Logo/GroupPayLogo';
import PasswordStrength from '../components/PasswordStrength';
import { userApi } from '../services/api';

/**
 * Signup Page Component
 * Handles new user registration
 * Features form validation and password strength checking
 */
const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return value.length < 2 ? 'Name is too short' : '';
      case 'email':
        return !/\S+@\S+\.\S+/.test(value) ? 'Invalid email address' : '';
      case 'password':
        return value.length < 8 ? 'Password must be at least 8 characters' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : '';
      case 'phoneNumber':
        return !/^\d{10}$/.test(value) ? 'Phone number must be 10 digits' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
    if (apiError) setApiError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setApiError('');
      
      try {
        const userData = {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber
        };
        
        const response = await userApi.register(userData);
        if (response.id) {
          navigate('/login', { 
            state: { message: 'Account created successfully! Please log in.' }
          });
        } else {
          setApiError('Registration failed. Please try again.');
        }
      } catch (error) {
        setApiError(error.message || 'An error occurred during registration.');
      } finally {
        setIsLoading(false);
      }
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
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join GroupPay and start splitting bills with friends
          </p>
        </div>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border
                           ${errors.fullName && touched.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'}
                           bg-white dark:bg-gray-900 
                           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           transition-all duration-200`}
                />
                <AnimatePresence>
                  {touched.fullName && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {errors.fullName ? (
                        <FiX className="text-red-500" />
                      ) : (
                        <FiCheck className="text-green-500" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {touched.fullName && errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.fullName}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border
                           ${errors.email && touched.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'}
                           bg-white dark:bg-gray-900 
                           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           transition-all duration-200`}
                />
                <AnimatePresence>
                  {touched.email && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {errors.email ? (
                        <FiX className="text-red-500" />
                      ) : (
                        <FiCheck className="text-green-500" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {touched.email && errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="1234567890"
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border
                           ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'}
                           bg-white dark:bg-gray-900 
                           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           transition-all duration-200`}
                />
                <AnimatePresence>
                  {touched.phoneNumber && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {errors.phoneNumber ? (
                        <FiX className="text-red-500" />
                      ) : (
                        <FiCheck className="text-green-500" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {touched.phoneNumber && errors.phoneNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.phoneNumber}
                </motion.p>
              )}
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
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-2 rounded-xl border
                           ${errors.password && touched.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'}
                           bg-white dark:bg-gray-900 
                           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <PasswordStrength password={formData.password} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-2 rounded-xl border
                           ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'}
                           bg-white dark:bg-gray-900 
                           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-xl text-sm"
              >
                {apiError}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 
                       hover:from-indigo-600 hover:to-purple-600
                       text-white font-medium rounded-xl shadow-lg
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          {/* Social Signup Options */}
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

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage; 