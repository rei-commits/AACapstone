import { motion } from 'framer-motion';
import { FiBell, FiCheck, FiDollarSign, FiUserPlus } from 'react-icons/fi';

export default function NotificationsDropdown({ isOpen, onClose }) {
  const notifications = [
    {
      id: 1,
      type: 'payment',
      message: 'Tiana Martinez paid you $25.50',
      time: '2 hours ago',
      icon: <FiDollarSign className="text-green-500" />,
      read: false
    },
    {
      id: 2,
      type: 'request',
      message: 'Charly Acevedo requested $32.75',
      time: '1 day ago',
      icon: <FiDollarSign className="text-blue-500" />,
      read: false
    },
    {
      id: 3,
      type: 'friend',
      message: 'Jonel Rodriguez added you as a friend',
      time: '3 days ago',
      icon: <FiUserPlus className="text-purple-500" />,
      read: true
    }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute right-0 mt-2 w-[96vw] sm:w-96 bg-white dark:bg-[#1a1b2e] rounded-xl shadow-lg 
        border border-gray-200 dark:border-gray-800 overflow-hidden z-50 max-h-[80vh] sm:max-h-[600px]
        sm:right-0 right-[-45vw]"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 
            bg-clip-text text-transparent">
            Notifications
          </h3>
          <button className="text-sm text-purple-500 hover:text-purple-600">
            Mark all as read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors 
                  ${notification.read ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    {notification.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                      <FiCheck className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No new notifications
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="w-full text-sm text-gray-500 hover:text-purple-500 transition-colors">
          View all notifications
        </button>
      </div>
    </motion.div>
  );
} 