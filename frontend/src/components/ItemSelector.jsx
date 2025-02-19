import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import TaxTipCalculator from './TaxTipCalculator';

export default function ItemSelector({ 
  items, 
  participants, 
  onAssignment,
  taxAndTip,
  onTipChange 
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [assignments, setAssignments] = useState({});

  const handleAssignment = (itemId, participantId) => {
    try {
      console.log('Assigning item:', itemId, 'to participant:', participantId);
      
      if (!itemId || !participantId) {
        console.error('Missing itemId or participantId:', { itemId, participantId });
        return;
      }

      setAssignments(prev => {
        const newAssignments = { ...prev };
        
        // Initialize array if needed
        if (!newAssignments[itemId]) {
          newAssignments[itemId] = [];
        }

        // Toggle assignment
        const isAssigned = newAssignments[itemId].includes(participantId);
        
        if (isAssigned) {
          // Remove assignment
          newAssignments[itemId] = newAssignments[itemId].filter(id => id !== participantId);
          if (newAssignments[itemId].length === 0) {
            delete newAssignments[itemId];
          }
        } else {
          // Add assignment
          newAssignments[itemId] = [...newAssignments[itemId], participantId];
        }

        console.log('Updated assignments:', newAssignments);
        onAssignment?.(itemId, participantId, !isAssigned ? 'add' : 'remove');
        
        return newAssignments;
      });

      // Don't close the dropdown after assignment to allow multiple selections
      // setSelectedItem(null);

    } catch (err) {
      console.error('Error in handleAssignment:', err);
      setError(err.message);
    }
  };

  // Render item list with assignments
  const renderItems = () => {
    return items.map(item => (
      <div key={item.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-white">{item.name}</h4>
            <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Show assigned participants */}
            <div className="flex gap-1">
              {assignments[item.id]?.map(participantId => {
                const participant = participants.find(p => p.id === participantId);
                if (!participant) return null;
                
                return (
                  <button
                    key={participantId}
                    onClick={() => handleAssignment(item.id, participantId)}
                    className="h-8 px-3 rounded-full bg-purple-500/20 text-purple-300 
                             hover:bg-purple-500/30 transition-colors flex items-center gap-2"
                  >
                    <span>{participant.name.split(' ')[0]}</span>
                    <FiX className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
            
            {/* Add participant button */}
            <button
              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
              className="w-8 h-8 rounded-full border-2 border-dashed border-gray-600
                       hover:border-purple-500 flex items-center justify-center"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Participant selection dropdown */}
        {selectedItem === item.id && (
          <div className="mt-3 p-2 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Select participants to split with:</p>
            <div className="space-y-1">
              {participants.map(participant => {
                const isAssigned = assignments[item.id]?.includes(participant.id);
                return (
                  <button
                    key={participant.id}
                    onClick={() => handleAssignment(item.id, participant.id)}
                    className={`w-full p-2 rounded-lg flex items-center gap-2
                      ${isAssigned 
                        ? 'bg-purple-500/20 text-purple-300' 
                        : 'hover:bg-gray-700 text-white'
                      }`}
                  >
                    <span>{participant.name}</span>
                    {isAssigned && <FiX className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    ));
  };

  const getInitials = (name) => {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const renderSummary = () => {
    // Calculate total number of participants for tax/tip splitting
    const numParticipants = participants.length + 1; // +1 for you

    return participants.map(friend => {
      // Calculate items total for this friend
      const friendItems = items
        .filter(item => assignments[item.id]?.includes(friend.id))
        .map(item => ({
          name: item.name,
          // Calculate share based on number of people assigned to this item
          amount: item.price / (assignments[item.id]?.length || 1)
        }));

      // Sum up all items assigned to this friend
      const itemsTotal = friendItems.reduce((sum, item) => sum + item.amount, 0);
      
      // Split tax and tip equally among all participants
      const taxShare = taxAndTip.tax / numParticipants;
      const tipShare = taxAndTip.tip / numParticipants;

      // Calculate final total
      const finalTotal = itemsTotal + taxShare + tipShare;

      return (
        <div key={friend.id} className="p-4 bg-gray-800 rounded-lg mb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
              {getInitials(friend.name)}
            </div>
            <span className="font-medium">{friend.name}</span>
            <span className="ml-auto font-bold">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
          
          {/* Show itemized breakdown */}
          <div className="space-y-1 text-sm text-gray-400">
            {friendItems.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{item.name}</span>
                <span>${item.amount.toFixed(2)}</span>
              </div>
            ))}
            
            {/* Show tax and tip shares */}
            <div className="flex justify-between text-xs">
              <span>Share of tax</span>
              <span>${taxShare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Share of tip</span>
              <span>${tipShare.toFixed(2)}</span>
            </div>

            {/* Total */}
            <div className="pt-1 mt-1 border-t border-gray-700">
              <div className="flex justify-between font-medium text-white">
                <span>Total to pay:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Scanned Items List */}
      <div className="space-y-3">
        {renderItems()}
      </div>

      {/* Add space between items and tip calculator */}
      <div className="my-6"></div>

      {/* Tip Calculator */}
      <TaxTipCalculator 
        subtotal={items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
        tax={taxAndTip.tax}
        onTipChange={onTipChange}
      />

      {/* Summary Section */}
      <div className="mt-6 border-t border-gray-700 pt-4">
        <h3 className="text-lg font-medium text-white mb-4">Summary</h3>
        <div className="space-y-4">
          {renderSummary()}
        </div>
      </div>
    </div>
  );
} 