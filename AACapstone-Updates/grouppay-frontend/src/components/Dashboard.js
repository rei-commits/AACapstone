import React, { useEffect, useState } from 'react';
import { FiPlus, FiDollarSign, FiPieChart } from 'react-icons/fi';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Get current user's display name or email
    const user = auth.currentUser;
    if (user) {
      const displayName = user.displayName || user.email.split('@')[0];
      setUserName(displayName.charAt(0).toUpperCase() + displayName.slice(1));
    }

    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 text-lg">
          {greeting}, <span className="font-medium text-indigo-600">{userName}</span>! 
        </p>
      </div>

      {/* Quick Stats - Only Essential Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">You are owed</h3>
          <p className="text-2xl font-bold text-green-600">$245.00</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">You owe</h3>
          <p className="text-2xl font-bold text-red-600">$123.00</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Groups</h3>
          <p className="text-2xl font-bold text-blue-600">5</p>
        </div>
      </div>

      {/* Quick Actions - Core Features */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <button 
          onClick={() => navigate('/create-group')}
          className="flex items-center justify-center gap-2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
        >
          <FiPlus className="w-5 h-5" />
          New Group
        </button>
        <button 
          onClick={() => navigate('/quick-settle')}
          className="flex items-center justify-center gap-2 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
        >
          <FiDollarSign className="w-5 h-5" />
          Quick Settle
        </button>
        <button 
          onClick={() => navigate('/quick-split')}
          className="flex items-center justify-center gap-2 bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600"
        >
          <FiPieChart className="w-5 h-5" />
          Split Bill
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Groups */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Groups</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  🍕
                </div>
                <div>
                  <p className="font-medium">Pizza Night</p>
                  <p className="text-sm text-gray-500">4 members</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">Total: $45.00</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FiDollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Dinner at Restaurant</p>
                <p className="text-sm text-gray-500">John paid $45.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Reminders */}
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          {/* Header with Sort/Filter */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Payment Reminders</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700">
                Send All Reminders
              </button>
            </div>
            
            {/* Sort/Filter Options */}
            <div className="flex gap-2 text-sm">
              <select className="border rounded-lg px-3 py-1 text-gray-600 bg-gray-50">
                <option value="all">All Groups</option>
                <option value="weekend">Weekend Hangout</option>
                <option value="movie">Movie Club</option>
              </select>
              <select className="border rounded-lg px-3 py-1 text-gray-600 bg-gray-50">
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          {/* Reminders List */}
          <div className="space-y-4">
            {/* Existing reminder items with updated styling */}
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  S
                </div>
                <div>
                  <p className="font-medium">Sarah</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Pizza Night
                    </span>
                    <span>•</span>
                    <span>Friday, Jan 20</span>
                    <span>•</span>
                    <span className="font-medium text-red-600">Due: $15.00</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    From group: Weekend Hangout
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button 
                  className="px-4 py-1.5 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-600 rounded-full hover:bg-indigo-50 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Remind
                </button>
                <span className="text-xs text-gray-400">Last reminded: 2 days ago</span>
              </div>
            </div>

            {/* ... other reminder items with same styling ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 