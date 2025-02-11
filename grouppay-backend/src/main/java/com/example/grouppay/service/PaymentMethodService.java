package com.example.grouppay.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.grouppay.exception.ResourceNotFoundException;
import com.example.grouppay.model.PaymentMethod;
import com.example.grouppay.repository.PaymentMethodRepository;

@Service
@Transactional
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    @Autowired
    public PaymentMethodService(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    public PaymentMethod createPaymentMethod(PaymentMethod paymentMethod) {
        return paymentMethodRepository.save(paymentMethod);
    }

    public PaymentMethod getPaymentMethodById(Long id) {
        return paymentMethodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found with id: " + id));
    }

    public List<PaymentMethod> getPaymentMethodsByUserId(Long userId) {
        return paymentMethodRepository.findByUserId(userId);
    }

    public PaymentMethod updatePaymentMethod(Long id, PaymentMethod paymentMethodDetails) {
        PaymentMethod paymentMethod = getPaymentMethodById(id);
        paymentMethod.setName(paymentMethodDetails.getName());
        paymentMethod.setType(paymentMethodDetails.getType());
        paymentMethod.setLastFour(paymentMethodDetails.getLastFour());
        paymentMethod.setExpiryDate(paymentMethodDetails.getExpiryDate());
        paymentMethod.setAccountType(paymentMethodDetails.getAccountType());
        return paymentMethodRepository.save(paymentMethod);
    }

    public void deletePaymentMethod(Long id) {
        paymentMethodRepository.deleteById(id);
    }
}