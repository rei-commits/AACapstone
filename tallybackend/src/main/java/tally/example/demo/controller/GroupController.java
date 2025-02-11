package tally.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tally.example.demo.dto.GroupDTO;
import tally.example.demo.dto.request.CreateGroupRequest;
import tally.example.demo.mapper.ModelMapper;
import tally.example.demo.model.Group;
import tally.example.demo.model.User;
import tally.example.demo.service.GroupService;
import tally.example.demo.service.UserService;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<GroupDTO> createGroup(@RequestBody CreateGroupRequest request, Authentication auth) {
        String userId = auth.getName();
        User creator = userService.getCurrentUser(userId);
        Group group = new Group();
        group.setName(request.getName());
        group.setCreator(creator);
        group.getMembers().add(creator);
        
        for (String memberId : request.getMemberIds()) {
            User member = userService.getUserById(memberId);
            group.getMembers().add(member);
        }

        group = groupService.createGroup(group);
        return ResponseEntity.ok(modelMapper.toGroupDTO(group));
    }

    @GetMapping
    public ResponseEntity<List<GroupDTO>> getMyGroups(Authentication auth) {
        String userId = auth.getName();
        List<Group> groups = groupService.getUserGroups(userId);
        List<GroupDTO> groupDTOs = groups.stream()
            .map(modelMapper::toGroupDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(groupDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDTO> getGroup(@PathVariable Long id) {
        Group group = groupService.getGroupById(id);
        return ResponseEntity.ok(modelMapper.toGroupDTO(group));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id, Authentication auth) {
        String userId = auth.getName();
        groupService.deleteGroup(id, userId);
        return ResponseEntity.ok().build();
    }
} 