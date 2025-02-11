package tally.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tally.example.demo.model.Bill;
import tally.example.demo.model.User;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByGroupId(Long groupId);
    List<Bill> findByParticipantsUserOrCreator(User user, User creator);
} 