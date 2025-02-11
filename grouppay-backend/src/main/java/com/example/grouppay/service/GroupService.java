package com.example.grouppay.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.grouppay.model.User;
import com.example.grouppay.model.Group;
import com.example.grouppay.repository.GroupRepository;
import com.example.grouppay.exception.ResourceNotFoundException;

@Service
@Transactional
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserService userService;

    @Autowired
    public GroupService(GroupRepository groupRepository, UserService userService) {
        this.groupRepository = groupRepository;
        this.userService = userService;
    }

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    public Group getGroupById(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + id));
    }

    public List<Group> searchGroupsByName(String name) {
        return groupRepository.findByNameContaining(name);
    }

    public List<Group> getGroupsByUserId(Long userId) {
        return groupRepository.findGroupsByUserId(userId);
    }

    public Group addMemberToGroup(Long groupId, Long userId) {
        Group group = getGroupById(groupId);
        User user = userService.getUserById(userId);
        group.getMembers().add(user);
        return groupRepository.save(group);
    }

    public Group removeMemberFromGroup(Long groupId, Long userId) {
        Group group = getGroupById(groupId);
        User user = userService.getUserById(userId);
        group.getMembers().remove(user);
        return groupRepository.save(group);
    }

    public Group updateGroup(Long id, Group groupDetails) {
        Group group = getGroupById(id);
        group.setName(groupDetails.getName());
        group.setDescription(groupDetails.getDescription());
        return groupRepository.save(group);
    }

    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
    }
}