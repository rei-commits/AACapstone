package com.example.grouppay.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.grouppay.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<User> searchByName(String searchTerm);
    
    @Query("SELECT u FROM User u JOIN u.transactions t WHERE t.bill.id = :groupId")
    List<User> findUsersByGroupId(Long groupId);
} 