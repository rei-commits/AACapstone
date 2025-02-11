package tally.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tally.example.demo.model.Group;
import tally.example.demo.model.User;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByMembersContainingOrCreator(User member, User creator);
} 