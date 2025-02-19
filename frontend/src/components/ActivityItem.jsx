export default function ActivityItem({ activity, darkMode }) {
  return (
    <div className={`p-4 rounded-lg ${
      darkMode ? 'bg-[#1F2037]' : 'bg-white'
    } shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-purple-500 text-white">
            {getActivityIcon(activity.type)}
          </div>
          <div>
            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {activity.title}
            </h3>
            {activity.participants && (
              <p className="text-sm text-gray-500">
                with {activity.participants.join(', ')}
              </p>
            )}
            <p className="text-sm text-gray-500">
              {typeof activity.date === 'string' ? activity.date : activity.date.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ${activity.amount.toFixed(2)}
          </p>
          <span className={
            activity.status === 'completed' 
              ? 'text-green-500' 
              : 'text-yellow-500'
          }>
            {activity.status}
          </span>
        </div>
      </div>
    </div>
  );
} 