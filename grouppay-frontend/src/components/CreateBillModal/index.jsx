import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCamera, FiUpload, FiPlus, FiCheck } from 'react-icons/fi';
import { useParticipants } from './hooks/useParticipants';
import { useBillCalculations } from './hooks/useBillCalculations';
import ReceiptUpload from './Steps/ReceiptUpload';
import Participants from './Steps/Participants';
import ItemSelection from './Steps/ItemSelection';

/**
 * CreateBillModal Component
 * 
 * A multi-step modal for creating and splitting bills. Features include:
 * - Receipt upload/scanning with item recognition
 * - Emoji and title selection for the bill
 * - Participant management with member/non-member handling
 * - Item assignment and cost splitting
 * - Tax and tip calculations
 */
const CreateBillModal = ({ isOpen, onClose }) => {
  // State
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Custom hooks
  const {
    billDetails,
    setBillDetails,
    calculateTotal,
    handleTipChange,
    handleCustomTipChange,
    addScannedItem,
    removeScannedItem,
    updateScannedItem,
    calculateShares
  } = useBillCalculations();

  const {
    participants,
    itemAssignments,
    handleAddParticipant,
    handleRemoveParticipant,
    handleFriendSelect,
    assignItemToParticipant,
    removeItemAssignment,
    handleSendInvite,
    formatPhoneNumber
  } = useParticipants(billDetails, setBillDetails);

  /**
   * Validates the current step
   */
  const validateStep = () => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!billDetails.title?.trim()) {
          newErrors.title = 'Please enter a title for the bill';
        }
        if (billDetails.scannedItems.length === 0) {
          newErrors.receipt = 'Please upload or scan a receipt';
        }
        break;
      case 2:
        if (billDetails.participants.length < 2) {
          newErrors.participants = 'Please add at least one other participant';
        }
        break;
      case 3:
        const unassignedItems = billDetails.scannedItems.some(item => 
          !itemAssignments[item.id] || itemAssignments[item.id].length === 0
        );
        if (unassignedItems) {
          newErrors.items = 'Please assign all items to at least one participant';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles moving to the next step
   */
  const handleNext = async () => {
    if (validateStep()) {
      if (step === 3) {
        setIsSubmitting(true);
        try {
          // Calculate final shares
          const shares = calculateShares(itemAssignments);
          
          // Update participant shares
          const updatedParticipants = billDetails.participants.map(p => ({
            ...p,
            share: shares[p.id].totalShare,
            items: shares[p.id].items
          }));

          // Send invites to non-members
          await Promise.all(
            updatedParticipants
              .filter(p => !p.isCurrentUser && !p.isMember)
              .map(p => handleSendInvite(p))
          );

          // Close modal
          onClose();
        } catch (error) {
          console.error('Error creating bill:', error);
          setErrors({ submit: 'Failed to create bill. Please try again.' });
        }
        setIsSubmitting(false);
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  /**
   * Renders the content for the current step
   */
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ReceiptUpload
            billDetails={billDetails}
            setBillDetails={setBillDetails}
            showScanner={showScanner}
            setShowScanner={setShowScanner}
            addScannedItem={addScannedItem}
            removeScannedItem={removeScannedItem}
            updateScannedItem={updateScannedItem}
            handleTipChange={handleTipChange}
            handleCustomTipChange={handleCustomTipChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <Participants
            billDetails={billDetails}
            participants={participants}
            handleAddParticipant={handleAddParticipant}
            handleRemoveParticipant={handleRemoveParticipant}
            handleFriendSelect={handleFriendSelect}
            formatPhoneNumber={formatPhoneNumber}
            errors={errors}
          />
        );
      case 3:
        return (
          <ItemSelection
            billDetails={billDetails}
            participants={participants}
            itemAssignments={itemAssignments}
            assignItemToParticipant={assignItemToParticipant}
            removeItemAssignment={removeItemAssignment}
            calculateShares={calculateShares}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold">
              {step === 1 ? 'Create New Bill' : step === 2 ? 'Add Participants' : 'Assign Items'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 flex justify-between p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
              onClick={() => setStep(prev => prev - 1)}
              disabled={step === 1}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                step === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Creating Bill...'
              ) : step === 3 ? (
                'Create Bill'
              ) : (
                'Next'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateBillModal; 