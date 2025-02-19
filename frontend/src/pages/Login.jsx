import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FiArrowLeft, FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Only check email verification if this is a new account
      const isNewAccount = localStorage.getItem('newAccount');
      if (isNewAccount && !user.emailVerified) {
        setError('Please verify your email before logging in.');
        toast.error('Please check your email for verification link');
        auth.signOut();
        return;
      }

      // Clear the new account flag
      localStorage.removeItem('newAccount');
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else {
        setError('Failed to log in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#14162E] flex flex-col items-center justify-center p-4"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] p-6"
      >
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Link to="/" className="flex items-center text-gray-400 hover:text-white group">
            <FiArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to home</span>
          </Link>
        </motion.div>

        {/* Logo and Title */}
        <motion.div 
          className="text-center space-y-2 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1 
            className="text-4xl font-bold text-[#8B5CF6]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            Tally
          </motion.h1>
          <h2 className="text-2xl font-semibold text-white">Welcome back!</h2>
          <p className="text-gray-400">
            Sign in to continue splitting bills with ease
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg pl-10 pr-4 py-3 text-gray-900"
                  placeholder="you@example.com"
                />
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg pl-10 pr-10 py-3 text-gray-900"
                  placeholder="••••••••"
                />
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-[#8B5CF6] hover:underline mt-1">
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8B5CF6] text-white rounded-lg py-3 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In
          </motion.button>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <span className="relative px-4 text-sm text-gray-400 bg-[#14162E]">
              Or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center p-3 bg-[#1F2037] rounded-lg"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
            </button>
            <button
              type="button"
              disabled
              className="flex items-center justify-center p-3 bg-[#1F2037] rounded-lg opacity-50"
            >
              <img src="/apple.svg" alt="Apple" className="w-5 h-5" />
            </button>
          </div>
        </motion.form>

        <p className="text-center mt-8 text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#8B5CF6] hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
} 