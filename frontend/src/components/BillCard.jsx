import { motion } from 'framer-motion';
import { FiCalendar, FiUser } from 'react-icons/fi';

export default function BillCard({ bill, onMarkAsPaid, onDelete }) {
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

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#1a1b2e] rounded-xl p-6 hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white text-lg font-semibold mb-1">
            {bill.name}
          </h3>
          <p className="text-gray-400 text-sm flex items-center">
            <FiCalendar className="mr-1" />
            {formatDate(bill.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            ${calculateTotal()}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {bill.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-300">
              {item.name} x{item.quantity}
            </span>
            <span className="text-gray-200">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Tax and Tip */}
      <div className="space-y-1 text-sm border-t border-gray-700/50 pt-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Tax</span>
          <span className="text-gray-300">${Number(bill.tax).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Tip</span>
          <span className="text-gray-300">${Number(bill.tip).toFixed(2)}</span>
        </div>
      </div>

      {/* Participants */}
      <div className="flex items-center justify-between border-t border-gray-700/50 pt-3">
        <div className="flex flex-col text-gray-400">
          <div className="flex items-center mb-2">
            <FiUser className="mr-2" />
            <span className="text-sm">Participants</span>
          </div>
          {bill.participants && bill.participants.length > 0 ? (
            <div className="space-y-1">
              {bill.participants.map(p => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 mr-4">{p.userName}</span>
                  <span className={`${p.paid ? 'text-green-400' : 'text-red-400'}`}>
                    ${p.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-500">No participants yet</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onMarkAsPaid(bill.id, 1)}
            className="px-3 py-1 text-sm bg-green-500/10 text-green-400 rounded-lg 
                     hover:bg-green-500/20 transition-colors"
          >
            Mark as Paid
          </button>
          {bill.creatorId === 1 && (
            <button
              onClick={() => onDelete(bill.id)}
              className="px-3 py-1 text-sm bg-red-500/10 text-red-400 rounded-lg 
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