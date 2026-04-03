package com.example.estore.controller;

import com.example.estore.dto.AuthRequest;
import com.example.estore.dto.AuthResponse;
import com.example.estore.dto.RegistrationRequest;
import com.example.estore.mapper.UserMapper;
import com.example.estore.model.User;
import com.example.estore.security.JwtService;
import com.example.estore.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public void register(@RequestBody RegistrationRequest request) {

        User user = UserMapper.fromRegistrationRequest(request);
        userService.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {

        System.out.println("LOGIN = " + request.getLogin());
        System.out.println("PASSWORD = " + request.getPassword());

        User user = userService.findByLogin(request.getLogin());
        System.out.println("FOUND USER = " + user);

        if(user == null || !user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid login or password");
        }
        String token = jwtService.generateToken(user.getId());
        return new AuthResponse(token);
    }

}

