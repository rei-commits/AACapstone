package tally.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tally.example.demo.model.BillParticipant;

@Repository
public interface BillParticipantRepository extends JpaRepository<BillParticipant, Long> {
} 