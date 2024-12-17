import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
import './index.css';
import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { createWorker } from 'tesseract.js';
import Dashboard from './components/Dashboard';
import QuickSplitBill from './components/QuickSplitBill';
import BillSplitter from './components/BillSplitter';
import QuickSettle from './components/QuickSettle';

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <nav className="glass-nav fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center animate-slideIn">
              <h1 className="text-3xl font-bold text-gradient">GroupPay</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/signup')}
                className="btn-primary animate-fadeIn"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="relative">
        <div className="hero-gradient absolute inset-0 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-5xl font-bold mb-6 text-gradient">
              Split Bills, Not Friendships
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto mb-8">
              Make group expenses fun and stress-free with our intuitive splitting tool
            </p>
            
            {/* Quick Access Options */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button 
                onClick={() => navigate('/quick-split')}
                className="btn-primary bg-green-500 hover:bg-green-600"
              >
                Quick Split (No Account Needed)
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="btn-primary"
              >
                Sign Up for More Features
              </button>
            </div>
          </div>

          {/* Quick Access Features */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Quick Split</h3>
              <p className="text-gray-600 mb-4">
                Split a bill instantly with friends - no account required
              </p>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Split bills equally or custom amounts
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Scan receipts to split items
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Share results instantly
                </li>
              </ul>
              <button 
                onClick={() => navigate('/quick-split')}
                className="btn-primary w-full"
              >
                Split a Bill Now
              </button>
            </div>

            <div className="card p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Create Account</h3>
              <p className="text-gray-600 mb-4">
                Get more features with a free account
              </p>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create and manage groups
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Track expenses over time
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Settle debts easily
                </li>
              </ul>
              <button 
                onClick={() => navigate('/signup')}
                className="btn-primary w-full"
              >
                Create Free Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user);
      navigate('/dashboard');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists. Please sign in instead.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters long.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          setError('An error occurred during sign up. Please try again.');
      }
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gradient mb-6">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-indigo-500/5 sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-xl text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Sign up
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      switch (error.code) {
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          setError('An error occurred during sign in. Please try again.');
      }
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gradient mb-6">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-indigo-500/5 sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-xl text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/signup')}
                className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="glass-nav fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gradient">GroupPay</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Create New Group Card */}
            <div 
              onClick={() => navigate('/create-group')}
              className="card p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Create New Group</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Start a new group to split expenses with friends
              </p>
            </div>

            {/* Recent Groups Card */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Groups</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  No groups yet. Create a new group to get started!
                </p>
              </div>
            </div>

            {/* Activity Card */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  No recent activity to show.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CreateGroupPage() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('👥');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState('');

  const commonEmojis = ['👥', '', '🎉', '🍕', '🎮', '⚽️', '💼', '🎓', '🏖️', '🎪'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }
    
    // For now, just create a temporary group object and navigate
    const tempGroupId = Date.now().toString(); // Temporary ID until we have a database
    const groupData = {
      id: tempGroupId,
      name: groupName,
      emoji: selectedEmoji,
      createdBy: auth.currentUser.uid,
      createdAt: new Date().toISOString(),
    };

    // You could store this in localStorage temporarily if needed
    localStorage.setItem(`group_${tempGroupId}`, JSON.stringify(groupData));
    
    navigate(`/group/${tempGroupId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="glass-nav fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-6">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-5xl hover:scale-110 transition-transform mb-4"
                title="Click to change emoji"
              >
                {selectedEmoji}
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Create New Group</h2>
            </div>
            
            {showEmojiPicker && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setSelectedEmoji(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                  Group Name
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full btn-primary"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function GroupPage() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    // Temporary sample messages
    {
      id: 1,
      text: "Added a new expense: Dinner - $50",
      sender: "John",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: "expense"
    },
    {
      id: 2,
      text: "Split equally between all members",
      sender: "Sarah",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: "message"
    }
  ]);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setResult] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSmsInput, setShowSmsInput] = useState(false);
  const [customMessage, setCustomMessage] = useState(
    `Join our GroupPay bill split! Use code: ${groupId}\n\nJoin here: ${window.location.href}`
  );
  const fileInputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  useEffect(() => {
    const loadGroupData = () => {
      try {
        const data = localStorage.getItem(`group_${groupId}`);
        if (data) {
          setGroupData(JSON.parse(data));
        } else {
          setError('Group not found');
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } catch (error) {
        setError('Error loading group');
      }
      setLoading(false);
    };

    loadGroupData();
  }, [groupId, navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "You",
      timestamp: new Date().toISOString(),
      type: "message"
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleReceiptScan = async (file) => {
    try {
      setScanning(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Initialize Tesseract worker
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      // Scan the receipt
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Process the text to extract items and prices
      const lines = text.split('\n');
      const items = [];
      const priceRegex = /\$?\d+\.\d{2}/;

      lines.forEach(line => {
        const price = line.match(priceRegex);
        if (price) {
          const itemName = line.replace(price[0], '').trim();
          if (itemName) {
            items.push({
              name: itemName,
              price: parseFloat(price[0].replace('$', ''))
            });
          }
        }
      });

      setResult(items);
      
      // Add a message to show the scan result
      const newMessage = {
        id: Date.now(),
        text: `Scanned Receipt:\n${items.map(item => `${item.name}: $${item.price}`).join('\n')}`,
        sender: "System",
        timestamp: new Date().toISOString(),
        type: "receipt"
      };
      setMessages(prev => [...prev, newMessage]);

    } catch (error) {
      console.error('Error scanning receipt:', error);
      alert('Error scanning receipt. Please try again.');
    } finally {
      setScanning(false);
      setShowReceiptUpload(false);
    }
  };

  const handleReceiptUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setShowReceiptUpload(true); // Show the preview modal first
      await handleReceiptScan(file);
    }
  };

  const handleShareLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setShowShareModal(true);
    setShowMenu(false);
  };

  const handleEndChat = () => {
    if (window.confirm('Are you sure you want to end this group chat?')) {
      navigate('/dashboard');
    }
  };

  const handleSendSMS = () => {
    // Use the custom message
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(customMessage)}`;
    } else {
      navigator.clipboard.writeText(customMessage);
      alert('Message copied! Please send it manually to the phone number.');
    }
    
    setPhoneNumber('');
    setShowSmsInput(false);
  };

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemPrice) return;
    
    setItems([
      ...items,
      {
        name: newItemName.trim(),
        price: parseFloat(newItemPrice)
      }
    ]);
    
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveItems = () => {
    // Format the message to match the receipt style
    const newMessage = {
      id: Date.now(),
      text: `Scanned Receipt:\n${items.map(item => 
        `${item.name} $: $${item.price.toFixed(2)}`
      ).join('\n')}`,
      sender: "System",
      timestamp: new Date().toISOString(),
      type: "receipt"
    };
    
    setMessages(prev => [...prev, newMessage]);
    setShowReceiptUpload(false);
    setItems([]);
  };

  const ReceiptPreview = () => (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="w-full max-w-md p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 text-white/80">
          <button 
            onClick={() => setShowReceiptUpload(false)}
            className="flex items-center"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Leave Bill
          </button>
          <div className="text-sm">
            Share code: {groupId}
          </div>
        </div>

        {/* Items List - Simple Two Column Layout */}
        <div className="space-y-8">
          {/* Items */}
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-white text-2xl">
                <div>{item.name}</div>
                <div>${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Add Item Input */}
          <div className="flex gap-4 mt-auto">
            <input
              type="text"
              placeholder="Item name"
              className="flex-1 bg-transparent border-b border-white/20 text-white text-2xl px-2 py-1 focus:outline-none focus:border-white/40"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <input
              type="number"
              placeholder="0.00"
              className="w-32 bg-transparent border-b border-white/20 text-white text-2xl px-2 py-1 focus:outline-none focus:border-white/40 text-right"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>

          {/* Add Button - Centered at Bottom */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleAddItem}
              className="text-white/60 hover:text-white text-xl"
            >
              +Add an item
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ShareModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gradient">Share Group Code</h2>
          <button 
            onClick={() => {
              setShowShareModal(false);
              setShowSmsInput(false);
              setPhoneNumber('');
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-indigo-600 font-mono">{groupId}</p>
          </div>

          <p className="text-gray-600">
            Give this code to everyone around the table so they can:
          </p>

          <ul className="space-y-2">
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Join the bill from their phones
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Select their own items
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Settle up within the app
            </li>
          </ul>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex flex-col space-y-4">
              {showSmsInput ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customize Message
                    </label>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 h-24 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSendSMS}
                      className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors"
                    >
                      Send SMS
                    </button>
                    <button
                      onClick={() => {
                        setShowSmsInput(false);
                        setPhoneNumber('');
                        setCustomMessage(
                          `Join our GroupPay bill split! Use code: ${groupId}\n\nJoin here: ${window.location.href}`
                        );
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Tip: You can customize the message to add personal notes or additional instructions
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowSmsInput(true)}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Share via SMS</span>
                </button>
              )}
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            The code has been copied to your clipboard
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="glass-nav fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{groupData?.emoji}</span>
              <h1 className="text-xl font-bold text-gray-900">{groupData?.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {/* Add expense functionality */}}
                className="btn-primary text-sm px-4"
              >
                Add Expense
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50">
                    <button
                      onClick={handleShareLink}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Share Group Link
                    </button>
                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Upload Receipt
                    </button>
                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Snap Receipt
                    </button>
                    <button
                      onClick={handleEndChat}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      End Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16 h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "receipt" ? "mx-4" : msg.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div className={`
                  ${msg.type === "receipt" 
                    ? "w-full bg-green-50/20 rounded-lg p-4 font-mono text-base"
                    : msg.sender === "You" 
                      ? "max-w-sm rounded-2xl px-4 py-2 shadow-sm bg-indigo-500 text-white"
                      : "max-w-sm rounded-2xl px-4 py-2 shadow-sm bg-white text-gray-900"}
                `}>
                  {msg.type === "receipt" ? (
                    <>
                      <div className="text-base mb-1">{msg.sender}</div>
                      <div className="whitespace-pre-line">{msg.text}</div>
                      <div className="text-gray-500 text-sm mt-2">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-medium mb-1">{msg.sender}</div>
                      <div className="text-sm">{msg.text}</div>
                      <div className={`text-xs mt-1 ${msg.sender === "You" ? "text-indigo-100" : "text-gray-500"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="btn-primary"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
      {showReceiptUpload && <ReceiptPreview />}
      {showShareModal && <ShareModal />}
      
      {/* Add this hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleReceiptUpload}
        capture="environment"
      />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/quick-split" element={<BillSplitter />} />
      <Route path="/quick-settle" element={<QuickSettle />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-group"
        element={
          <ProtectedRoute>
            <CreateGroupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/group/:groupId"
        element={
          <ProtectedRoute>
            <GroupPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
); 