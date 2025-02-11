package tally.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tally.example.demo.exception.ApiException;
import tally.example.demo.model.Group;
import tally.example.demo.model.User;
import tally.example.demo.repository.GroupRepository;
import tally.example.demo.repository.UserRepository;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    public List<Group> getUserGroups(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        return groupRepository.findByMembersContainingOrCreator(user, user);
    }

    public Group getGroupById(Long id) {
        return groupRepository.findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Group not found"));
    }

    @Transactional
    public void deleteGroup(Long id, String userId) {
        Group group = getGroupById(id);
        
        if (!group.getCreator().getUid().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the group creator can delete the group");
        }

        groupRepository.delete(group);
    }

    public boolean isUserInGroup(Long groupId, String userId) {
        Group group = getGroupById(groupId);
        return group.getMembers().stream()
            .anyMatch(member -> member.getUid().equals(userId));
    }
} 