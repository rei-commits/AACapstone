package com.example.grouppay.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.grouppay.model.Bill;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByCreatorId(Long creatorId);
    
    @Query("SELECT b FROM Bill b JOIN b.transactions t WHERE t.user.id = :userId")
    List<Bill> findBillsByUserId(Long userId);
} 