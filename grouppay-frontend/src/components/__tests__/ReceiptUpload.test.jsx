import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReceiptUpload from '../ReceiptUpload';
import { receiptService } from '../../services/receiptService';

// Mock the receipt service
jest.mock('../../services/receiptService');

describe('ReceiptUpload Component', () => {
    const mockOnUpload = jest.fn();
    const mockBillId = '123';

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('renders upload area and button', () => {
        render(<ReceiptUpload onUpload={mockOnUpload} billId={mockBillId} />);
        
        expect(screen.getByText(/Click or drag receipt to upload/i)).toBeInTheDocument();
        expect(screen.getByText(/Upload Receipt/i)).toBeInTheDocument();
    });

    it('handles valid file selection', async () => {
        render(<ReceiptUpload onUpload={mockOnUpload} billId={mockBillId} />);

        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const input = screen.getByLabelText(/Click or drag receipt to upload/i);

        fireEvent.change(input, { target: { files: [file] } });

        expect(screen.queryByText(/File is too large/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Invalid file type/i)).not.toBeInTheDocument();
    });

    it('shows error for large files', () => {
        render(<ReceiptUpload onUpload={mockOnUpload} billId={mockBillId} />);

        const largeFile = new File(['test'], 'large.jpg', { 
            type: 'image/jpeg',
        });
        Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 }); // 6MB

        const input = screen.getByLabelText(/Click or drag receipt to upload/i);
        fireEvent.change(input, { target: { files: [largeFile] } });

        expect(screen.getByText(/File is too large/i)).toBeInTheDocument();
    });

    it('shows error for invalid file types', () => {
        render(<ReceiptUpload onUpload={mockOnUpload} billId={mockBillId} />);

        const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
        const input = screen.getByLabelText(/Click or drag receipt to upload/i);

        fireEvent.change(input, { target: { files: [invalidFile] } });

        expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
    });

    it('handles successful upload', async () => {
        const mockResponse = { id: '1', url: 'test-url' };
        receiptService.uploadReceipt.mockResolvedValueOnce(mockResponse);

        render(<ReceiptUpload onUpload={mockOnUpload} billId={mockBillId} />);

        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const input = screen.getByLabelText(/Click or drag receipt to upload/i);

        fireEvent.change(input, { target: { files: [file] } });
        fireEvent.click(screen.getByText(/Upload Receipt/i));

        await waitFor(() => {
            expect(receiptService.uploadReceipt).toHaveBeenCalledWith(file, mockBillId);
            expect(mockOnUpload).toHaveBeenCalledWith(mockResponse);
        });
    });

    it('handles upload failure', async () => {
        const errorMessage = 'Upload failed';
        receiptService.uploadReceipt.mockRejectedValueOnce(new Error(errorMessage));

        render(<ReceiptUpload onUpload={mockOnUpload} billId={mockBillId} />);

        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const input = screen.getByLabelText(/Click or drag receipt to upload/i);

        fireEvent.change(input, { target: { files: [file] } });
        fireEvent.click(screen.getByText(/Upload Receipt/i));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    it('resets form after successful upload', async () => {
        receiptService.uploadReceipt.mockResolvedValueOnce({ id: '1' });

        render(<ReceiptUpload onUpload={mockOnUpload} billId={mockBillId} />);

        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const input = screen.getByLabelText(/Click or drag receipt to upload/i);

        fireEvent.change(input, { target: { files: [file] } });
        fireEvent.click(screen.getByText(/Upload Receipt/i));

        await waitFor(() => {
            expect(screen.queryByRole('img')).not.toBeInTheDocument();
            expect(screen.queryByText(/Uploading.../i)).not.toBeInTheDocument();
        });
    });
}); 