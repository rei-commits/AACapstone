// Mock SMS service for development
export const sendInviteSMS = async (phone, inviteCode) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Log for development
    console.log('Sending invite SMS:', {
      to: phone,
      code: inviteCode,
      timestamp: new Date().toISOString()
    });

    // Mock successful response
    return {
      success: true,
      messageId: `mock_${Date.now()}`,
      to: phone,
      status: 'sent',
      message: `Invite sent to ${phone} with code: ${inviteCode}`
    };

  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send invite SMS');
  }
}; 