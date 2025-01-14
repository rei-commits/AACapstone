import { useState } from 'react';
import { sendInviteSMS } from '../../../services/sms';

export const useParticipants = (billDetails, setBillDetails) => {
  // State
  const [itemAssignments, setItemAssignments] = useState({});
  const [participants, setParticipants] = useState([
    { id: 'current', name: 'You', avatar: 'You', isCurrentUser: true }
  ]);

  /**
   * Generates a random 6-character invite code
   */
  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  /**
   * Formats a phone number into (XXX) XXX-XXXX format
   */
  const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length < 4) return phone;
    if (phone.length < 7) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  /**
   * Adds a new non-member participant
   */
  const handleAddParticipant = () => {
    const code = generateInviteCode();
    setBillDetails(prev => ({
      ...prev,
      participants: [...prev.participants, { 
        id: Date.now(), 
        name: '', 
        phone: '',
        share: 0,
        percentage: 0,
        inviteCode: code,
        status: 'pending'
      }]
    }));
  };

  /**
   * Removes a participant from the bill
   */
  const handleRemoveParticipant = (id) => {
    setBillDetails(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== id)
    }));
    
    // Remove their item assignments
    const newAssignments = { ...itemAssignments };
    Object.keys(newAssignments).forEach(itemId => {
      newAssignments[itemId] = newAssignments[itemId].filter(pId => pId !== id);
    });
    setItemAssignments(newAssignments);
  };

  /**
   * Adds a friend as a participant
   */
  const handleFriendSelect = (friend) => {
    const isAlreadyAdded = billDetails.participants.some(p => p.phone === friend.phone);
    if (!isAlreadyAdded) {
      setBillDetails(prev => ({
        ...prev,
        participants: [...prev.participants, {
          id: Date.now(),
          name: friend.name,
          phone: friend.phone,
          avatar: friend.avatar,
          isMember: friend.isMember,
          share: 0,
          percentage: 0,
          inviteCode: generateInviteCode(),
          status: 'pending'
        }]
      }));
    }
  };

  /**
   * Assigns an item to a participant
   */
  const assignItemToParticipant = (itemId, participantId) => {
    setItemAssignments(prev => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), participantId]
    }));
  };

  /**
   * Removes an item assignment from a participant
   */
  const removeItemAssignment = (itemId, participantId) => {
    setItemAssignments(prev => ({
      ...prev,
      [itemId]: prev[itemId].filter(id => id !== participantId)
    }));
  };

  /**
   * Sends an SMS invite to a participant
   */
  const handleSendInvite = async (participant) => {
    if (!participant.phone) return;
    
    try {
      await sendInviteSMS(participant.phone, participant.inviteCode);
      const newParticipants = billDetails.participants.map(p => 
        p.id === participant.id ? { ...p, inviteSent: true } : p
      );
      setBillDetails(prev => ({ ...prev, participants: newParticipants }));
    } catch (error) {
      console.error('Error sending invite:', error);
    }
  };

  return {
    participants,
    itemAssignments,
    handleAddParticipant,
    handleRemoveParticipant,
    handleFriendSelect,
    assignItemToParticipant,
    removeItemAssignment,
    handleSendInvite,
    formatPhoneNumber
  };
}; 