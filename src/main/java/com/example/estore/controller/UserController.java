package com.example.estore.controller;

import com.example.estore.dto.UserResponse;
import com.example.estore.mapper.UserMapper;
import com.example.estore.model.User;
import com.example.estore.service.UserService;
import com.springframework.security.core.context.SecurityContextHolder;
import com.springframework.web.bind.annotation.GetMapping;
import com.springframework.web.bind.annotation.RequestMapping;
import com.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    private Long getUserId() {
        return (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    @GetMapping("/me")
    public UserResponse getProfile() {
        Long userId = getUserId();
        User user = userService.findById(getUserId());
        if(user == null) {
            throw new RuntimeException("User not found");
        }
        return UserMapper.toUserResponse(user);
    }

}
