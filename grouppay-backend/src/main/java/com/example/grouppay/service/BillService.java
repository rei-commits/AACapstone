package com.example.grouppay.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.grouppay.exception.ResourceNotFoundException;
import com.example.grouppay.model.Bill;
import com.example.grouppay.repository.BillRepository;

@Service
@Transactional
public class BillService {

    private final BillRepository billRepository;

    @Autowired
    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    public Bill createBill(Bill bill) {
        return billRepository.save(bill);
    }

    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Bill> getBillsByCreator(Long creatorId) {
        return billRepository.findByCreatorId(creatorId);
    }

    @Transactional(readOnly = true)
    public List<Bill> getBillsByUserId(Long userId) {
        return billRepository.findBillsByUserId(userId);
    }

    public Bill updateBill(Long id, Bill billDetails) {
        Bill bill = getBillById(id);
        bill.setTitle(billDetails.getTitle());
        bill.setEmoji(billDetails.getEmoji());
        bill.setSubtotal(billDetails.getSubtotal());
        bill.setTax(billDetails.getTax());
        bill.setTip(billDetails.getTip());
        bill.setTotal(billDetails.getTotal());
        bill.setStatus(billDetails.getStatus());
        return billRepository.save(bill);
    }

    public void deleteBill(Long id) {
        billRepository.deleteById(id);
    }
}