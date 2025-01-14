const API_BASE_URL = '/api/receipts';

export const receiptService = {
    async uploadReceipt(file, billId, merchantName = 'Unknown') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('billId', billId);
        formData.append('merchantName', merchantName);

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload receipt');
            }

            return await response.json();
        } catch (error) {
            console.error('Receipt upload error:', error);
            throw error;
        }
    },

    async getReceiptsByBillId(billId) {
        try {
            const response = await fetch(`${API_BASE_URL}/bill/${billId}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch receipts');
            }

            return await response.json();
        } catch (error) {
            console.error('Fetch receipts error:', error);
            throw error;
        }
    },

    async getReceiptImage(receiptId) {
        try {
            const response = await fetch(`${API_BASE_URL}/${receiptId}/image`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch receipt image');
            }

            return await response.blob();
        } catch (error) {
            console.error('Fetch receipt image error:', error);
            throw error;
        }
    },

    async deleteReceipt(receiptId) {
        try {
            const response = await fetch(`${API_BASE_URL}/${receiptId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete receipt');
            }

            return true;
        } catch (error) {
            console.error('Delete receipt error:', error);
            throw error;
        }
    }
}; 