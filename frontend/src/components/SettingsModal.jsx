import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Modal from './Modal';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function SettingsModal({ isOpen, onClose, darkMode, userName, onUpdateDisplayName }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const auth = getAuth();
  const [displayNameEdit, setDisplayNameEdit] = useState(userName);

  const handleDeactivateClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDeactivate = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('No user is signed in');
            alert('Please sign in again');
            return;
        }

        // Get a fresh token
        const token = await user.getIdToken(true);
        console.log('Got fresh token, proceeding with deactivation');

        // First delete the account from backend
        const response = await axios.delete('http://localhost:8080/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                confirmed: true
            }
        });

        console.log('Deactivation successful:', response.data);
        
        // Then sign out from Firebase
        await auth.signOut();
        console.log('Signed out from Firebase');

        alert('Your account has been successfully deactivated.');
        
        // Close modals and redirect
        setShowConfirmDialog(false);
        onClose();
        navigate('/');

    } catch (error) {
        console.error('Deactivation error:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
            alert(error.response.data.error || 'Failed to deactivate account. Please try again.');
        } else {
            alert('Network error. Please try again.');
        }
        // If there was an error, try to sign out anyway
        try {
            await auth.signOut();
        } catch (e) {
            console.error('Error signing out:', e);
        }
        navigate('/');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateDisplayName();
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      onClose(); // Close the settings modal
      navigate('/'); // Redirect to landing page
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-[400px] bg-[#1A1C2E] rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-3">
            <h2 className="text-lg">Settings</h2>
            <button onClick={onClose}>
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 px-3">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-1.5 rounded-lg transition-colors ${
                activeTab === 'general' ? 'text-white' : 'text-gray-400'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-1.5 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-[#2A2C4E] text-white' : 'text-gray-400'
              }`}
            >
              Profile
            </button>
          </div>

          {/* Content */}
          <div className="px-3 py-2 space-y-3">
            {activeTab === 'profile' ? (
              <>
                <div>
                  <h3 className="text-sm mb-1">Profile Information</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={displayNameEdit}
                        onChange={(e) => setDisplayNameEdit(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 
                                      text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-purple-500 text-white 
                                      hover:bg-purple-600 disabled:opacity-50"
                        disabled={!displayNameEdit.trim() || displayNameEdit === userName}
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                <div>
                  <h3 className="text-sm mb-1">Payment Methods</h3>
                  <div className="p-2 bg-[#2A2C4E] rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm">
                      <span>•••• 4242</span>
                      <span className="text-xs text-gray-400">Expires 12/24</span>
                    </div>
                    <button className="text-red-500 text-sm">Remove</button>
                  </div>
                  <button className="w-full mt-1 p-2 text-gray-400 text-sm border border-dashed border-gray-600 rounded-lg">
                    + Add New Card
                  </button>
                </div>

                <div>
                  <h3 className="text-sm mb-1">Notifications</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center p-2 bg-[#2A2C4E] rounded-lg text-sm">
                      <span>Email Notifications</span>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                    <div className="flex justify-between items-center p-2 bg-[#2A2C4E] rounded-lg text-sm">
                      <span>Push Notifications</span>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm mb-1">Account</h3>
                  <div className="space-y-1">
                    <button className="w-full p-2 text-left bg-[#2A2C4E] rounded-lg text-sm">
                      Export Data
                    </button>
                    <button
                      onClick={handleDeactivateClick}
                      className="w-full p-2 text-left bg-[#2A2C4E] rounded-lg text-sm text-yellow-500"
                    >
                      Deactivate Account
                    </button>
                    <div className="p-2 bg-[#2A2C4E] rounded-lg">
                      <button 
                        onClick={handleSignOut}
                        className="w-full p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm mb-1">Language</h3>
                  <select className="w-full p-2 bg-[#2A2C4E] rounded-lg border-none text-sm">
                    <option>System</option>
                    <option>English</option>
                    <option>Spanish</option>
                  </select>
                </div>
                <div>
                  <h3 className="text-sm mb-1">Theme</h3>
                  <select className="w-full p-2 bg-[#2A2C4E] rounded-lg border-none text-sm">
                    <option>System</option>
                    <option>Light</option>
                    <option>Dark</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      {showConfirmDialog && (
        <Modal isOpen={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
          <div className="w-[400px] bg-[#1A1C2E] rounded-xl">
            <div className="flex items-center justify-between p-3">
              <h2 className="text-lg">Confirm Account Deactivation</h2>
              <button onClick={() => setShowConfirmDialog(false)}>
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-300">
                Are you sure you want to deactivate your account? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 p-3 bg-[#2A2C4E] rounded-b-xl">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-sm bg-gray-600 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeactivate}
                className="px-4 py-2 text-sm bg-red-500 rounded-lg hover:bg-red-600"
              >
                Proceed with Deactivation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
} 