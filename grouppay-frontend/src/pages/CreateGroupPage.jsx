import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiX, FiArrowLeft, FiSearch, FiUser } from 'react-icons/fi';
import { groupApi, userApi } from '../services/api';

const CreateGroupPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      // In a real application, you would have an API endpoint to search users
      // For now, we'll use the existing users we created
      const results = await userApi.searchUsers(query);
      setSearchResults(results.filter(u => u.id !== user.id));
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleAddMember = (member) => {
    if (!selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers(prev => [...prev, member]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveMember = (memberId) => {
    setSelectedMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Group name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const groupData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        createdBy: user.id,
        members: selectedMembers.map(m => m.id)
      };

      const response = await groupApi.createGroup(groupData);
      if (response.id) {
        navigate(`/groups/${response.id}`);
      } else {
        setError('Failed to create group');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => navigate('/dashboard')}
              className="mr-4 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <FiArrowLeft size={24} />
            </motion.button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Group
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter group name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-900 
                           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a description for your group"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-900 
                           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Member Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Add Members</h2>
            
            {/* Search Input */}
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users by name or email"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-900 
                         focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                         transition-all duration-200"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-4 max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                {searchResults.map(result => (
                  <motion.div
                    key={result.id}
                    whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                    className="p-2 flex items-center justify-between cursor-pointer"
                    onClick={() => handleAddMember(result)}
                  >
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      <span>{result.fullName}</span>
                    </div>
                    <FiPlus className="text-indigo-500" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Selected Members */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Selected Members:</h3>
              {selectedMembers.length === 0 ? (
                <p className="text-sm text-gray-500">No members selected</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map(member => (
                    <motion.div
                      key={member.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 
                               text-indigo-600 dark:text-indigo-400 rounded-full"
                    >
                      <span className="text-sm">{member.fullName}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-indigo-400 hover:text-indigo-600 dark:text-indigo-500 dark:hover:text-indigo-300"
                      >
                        <FiX size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500"
            >
              {error}
            </motion.div>
          )}

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-500 text-white rounded-lg
                       hover:bg-indigo-600 transition-colors duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Group'}
            </motion.button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateGroupPage; 