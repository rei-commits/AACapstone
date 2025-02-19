import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function MoneyRain({ isVisible, onComplete }) {
  const [moneyBills, setMoneyBills] = useState([]);

  useEffect(() => {
    if (isVisible) {
      // Increased to 30 bills for more effect
      const bills = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        delay: Math.random() * 1, // Increased delay spread
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1 // Random sizes for more variety
      }));
      setMoneyBills(bills);

      // Increased to 5 seconds
      const timer = setTimeout(() => {
        onComplete?.();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {moneyBills.map((bill) => (
        <motion.div
          key={bill.id}
          initial={{ y: -100, x: bill.x, rotate: bill.rotation, opacity: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: [0, 1, 1, 0],
            rotate: bill.rotation + 360
          }}
          transition={{
            duration: 2,
            delay: bill.delay,
            ease: "linear"
          }}
          className="absolute"
        >
          <svg
            width="40"
            height="20"
            viewBox="0 0 40 20"
            className="text-green-500 fill-current"
          >
            <rect width="40" height="20" rx="2" />
            <circle cx="20" cy="10" r="6" className="text-green-600 fill-current" />
            <rect x="5" y="8" width="6" height="4" rx="1" className="text-green-400 fill-current" />
            <rect x="29" y="8" width="6" height="4" rx="1" className="text-green-400 fill-current" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
} 