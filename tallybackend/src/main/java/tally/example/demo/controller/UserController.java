package tally.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tally.example.demo.dto.UserDTO;
import tally.example.demo.mapper.ModelMapper;
import tally.example.demo.model.User;
import tally.example.demo.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO, Authentication auth) {
        String userId = auth.getName();
        User user = userService.createUser(
            userId,
            userDTO.getEmail(),
            userDTO.getName(),
            userDTO.getPhotoUrl()
        );
        return ResponseEntity.ok(modelMapper.toUserDTO(user));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication auth) {
        String userId = auth.getName();
        User user = userService.getCurrentUser(userId);
        return ResponseEntity.ok(modelMapper.toUserDTO(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(modelMapper.toUserDTO(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO userDTO, Authentication auth) {
        String userId = auth.getName();
        User user = userService.updateUser(
            userId,
            userDTO.getEmail(),
            userDTO.getName(),
            userDTO.getPhotoUrl()
        );
        return ResponseEntity.ok(modelMapper.toUserDTO(user));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteUser(Authentication auth) {
        String userId = auth.getName();
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }
} 