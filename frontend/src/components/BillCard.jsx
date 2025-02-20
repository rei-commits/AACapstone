import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useState } from 'react';

export default function BillCard({ bill, onMarkAsPaid, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateTotal = () => {
    const itemsTotal = bill.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    return (itemsTotal + Number(bill.tax) + Number(bill.tip)).toFixed(2);
  };

  // Need to consolidate duplicate items to keep the list clean
  const consolidatedItems = bill.items.reduce((acc, item) => {
    const existingItem = acc.find(i => i.name === item.name && i.price === item.price);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[#1a1b2e] rounded-xl p-4 hover:shadow-xl transition-all"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-white text-lg font-semibold">
            {bill.name}
          </h3>
          <p className="text-gray-400 text-xs flex items-center">
            <FiCalendar className="mr-1" />
            {formatDate(bill.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            ${calculateTotal()}
          </p>
        </div>
      </div>

      {/* Expandable Items Section */}
      <div 
        className="cursor-pointer flex items-center justify-between text-gray-400 text-sm py-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Items ({consolidatedItems.length})</span>
        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
      </div>

      {/* Items */}
      {isExpanded && (
        <div className="space-y-1 mb-3">
          {consolidatedItems.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-300">
                {item.quantity > 1 ? `${item.name} (×${item.quantity})` : item.name}
              </span>
              <span className="text-gray-200 ml-2">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          
          {/* Tax and Tip */}
          <div className="text-sm border-t border-gray-700/50 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Tax</span>
              <span className="text-gray-300">${Number(bill.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tip</span>
              <span className="text-gray-300">${Number(bill.tip).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Participants */}
      <div className="flex items-center justify-between border-t border-gray-700/50 pt-2">
        <div className="flex-1">
          {bill.participants && bill.participants.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {bill.participants.map(p => (
                <div key={p.id} 
                     className="text-xs px-2 py-1 rounded-full bg-gray-800/50">
                  <span className="text-gray-300">{p.userName}</span>
                  <span className={`ml-2 ${p.paid ? 'text-green-400' : 'text-red-400'}`}>
                    ${p.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-2">
          <button
            onClick={() => onMarkAsPaid(bill.id, 1)}
            className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-lg 
                     hover:bg-green-500/20 transition-colors"
          >
            Paid
          </button>
          {bill.creatorId === 1 && (
            <button
              onClick={() => onDelete(bill.id)}
              className="px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded-lg 
                       hover:bg-red-500/20 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
} 