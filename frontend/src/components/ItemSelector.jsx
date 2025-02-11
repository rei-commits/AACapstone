import { useState } from 'react';

export default function ItemSelector({ items, participants, onItemAssignment }) {
  const [assignments, setAssignments] = useState({});

  const handleAssignment = (itemId, participantId) => {
    const newAssignments = {
      ...assignments,
      [itemId]: participantId
    };
    setAssignments(newAssignments);
    onItemAssignment(newAssignments);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <select
              value={assignments[item.id] || ''}
              onChange={(e) => handleAssignment(item.id, e.target.value)}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2A2C4E]"
            >
              <option value="">Assign to...</option>
              {participants.map((participant) => (
                <option key={participant.uid} value={participant.uid}>
                  {participant.name}
                </option>
              ))}
              <option value="split">Split Equally</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
} 