package com.example.estore.controller;

import com.example.estore.dto.UserResponse;
import com.example.estore.mapper.UserMapper;
import com.example.estore.model.User;
import com.example.estore.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    private Long getUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null) {
            throw new RuntimeException("Unauthorized");
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof Long userId) {
            return userId;
        }

        throw new RuntimeException("Unauthorized");
    }

    @GetMapping("/me")
    public UserResponse getProfile() {
        User user = userService.findById(getUserId());

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return UserMapper.toUserResponse(user);
    }
}