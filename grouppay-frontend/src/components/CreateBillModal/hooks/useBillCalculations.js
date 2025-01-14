import { useState } from 'react';

export const useBillCalculations = () => {
  // State for bill details
  const [billDetails, setBillDetails] = useState({
    title: '',
    description: '',
    emoji: '🧾',
    scannedItems: [],
    participants: [],
    subtotal: 0,
    tax: 0,
    tipPercentage: 18,
    customTipPercentage: '',
    total: 0
  });

  /**
   * Calculates the total amount including tax and tip
   */
  const calculateTotal = () => {
    const subtotal = billDetails.scannedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = billDetails.tax || 0;
    const tipAmount = (subtotal * (billDetails.tipPercentage / 100));
    const total = subtotal + tax + tipAmount;

    setBillDetails(prev => ({
      ...prev,
      subtotal,
      total
    }));

    return { subtotal, tax, tipAmount, total };
  };

  /**
   * Updates the tip percentage and recalculates totals
   */
  const handleTipChange = (percentage) => {
    setBillDetails(prev => ({
      ...prev,
      tipPercentage: percentage,
      customTipPercentage: ''
    }));
    calculateTotal();
  };

  /**
   * Handles custom tip percentage input
   */
  const handleCustomTipChange = (value) => {
    const tipValue = Math.min(Math.max(0, Number(value) || 0), 100);
    setBillDetails(prev => ({
      ...prev,
      tipPercentage: tipValue,
      customTipPercentage: value
    }));
    calculateTotal();
  };

  /**
   * Adds a scanned item to the bill
   */
  const addScannedItem = (item) => {
    setBillDetails(prev => ({
      ...prev,
      scannedItems: [...prev.scannedItems, item]
    }));
    calculateTotal();
  };

  /**
   * Removes a scanned item from the bill
   */
  const removeScannedItem = (itemId) => {
    setBillDetails(prev => ({
      ...prev,
      scannedItems: prev.scannedItems.filter(item => item.id !== itemId)
    }));
    calculateTotal();
  };

  /**
   * Updates a scanned item's details
   */
  const updateScannedItem = (itemId, updates) => {
    setBillDetails(prev => ({
      ...prev,
      scannedItems: prev.scannedItems.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
    calculateTotal();
  };

  /**
   * Calculates individual shares based on item assignments
   */
  const calculateShares = (itemAssignments) => {
    const { subtotal, tax, tipAmount, total } = calculateTotal();
    const participants = billDetails.participants;
    
    // Initialize shares
    const shares = participants.reduce((acc, p) => ({ 
      ...acc, 
      [p.id]: { items: [], baseShare: 0, taxShare: 0, tipShare: 0, totalShare: 0 } 
    }), {});

    // Calculate base shares from item assignments
    billDetails.scannedItems.forEach(item => {
      const assignedParticipants = itemAssignments[item.id] || [];
      if (assignedParticipants.length > 0) {
        const shareAmount = (item.price * item.quantity) / assignedParticipants.length;
        assignedParticipants.forEach(participantId => {
          shares[participantId].items.push(item);
          shares[participantId].baseShare += shareAmount;
        });
      }
    });

    // Calculate tax and tip shares
    const participantCount = participants.length;
    const taxPerPerson = tax / participantCount;
    const tipPerPerson = tipAmount / participantCount;

    // Update total shares
    participants.forEach(participant => {
      const share = shares[participant.id];
      share.taxShare = taxPerPerson;
      share.tipShare = tipPerPerson;
      share.totalShare = share.baseShare + taxPerPerson + tipPerPerson;
    });

    return shares;
  };

  return {
    billDetails,
    setBillDetails,
    calculateTotal,
    handleTipChange,
    handleCustomTipChange,
    addScannedItem,
    removeScannedItem,
    updateScannedItem,
    calculateShares
  };
}; 