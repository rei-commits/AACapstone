package tally.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tally.example.demo.dto.UserDTO;
import tally.example.demo.mapper.ModelMapper;
import tally.example.demo.model.User;
import tally.example.demo.service.UserService;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        User user = userService.createUser(userDTO.getEmail(), userDTO.getName());
        return ResponseEntity.ok(modelMapper.toUserDTO(user));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestParam Long userId) {
        User user = userService.getCurrentUser(userId);
        return ResponseEntity.ok(modelMapper.toUserDTO(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateUser(
            @RequestParam Long userId,
            @RequestBody UserDTO userDTO) {
        User user = userService.updateUser(userId, userDTO.getEmail(), userDTO.getName(), userDTO.getPhotoUrl());
        return ResponseEntity.ok(modelMapper.toUserDTO(user));
    }

    @PostMapping("/me/friends")
    public ResponseEntity<String> addFriend(
            @RequestParam Long userId,
            @RequestParam Long friendId) {
        userService.addFriend(userId, friendId);
        return ResponseEntity.ok("Friend added successfully");
    }

    @GetMapping("/friends")
    public ResponseEntity<List<UserDTO>> getFriends(@RequestParam Long userId) {
        List<User> friends = userService.getFriends(userId);
        return ResponseEntity.ok(modelMapper.toUserDTOs(friends));
    }
} 