export default function Button({ children, ...props }) {
  return (
    <button
      className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
      {...props}
    >
      {children}
    </button>
  );
} 