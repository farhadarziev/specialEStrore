package com.example.estore.controller;

import com.example.estore.dto.AuthRequest;
import com.example.estore.dto.AuthResponse;
import com.example.estore.dto.RegistrationRequest;
import com.example.estore.mapper.UserMapper;
import com.example.estore.model.User;
import com.example.estore.security.JwtService;
import com.example.estore.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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

        String login = request.getLogin() == null ? "" : request.getLogin().trim();
        String password = request.getPassword() == null ? "" : request.getPassword().trim();
        String name = request.getName() == null ? "" : request.getName().trim();
        String surname = request.getSurname() == null ? "" : request.getSurname().trim();
        String phoneNum = request.getPhoneNum() == null ? "" : request.getPhoneNum().trim();

        if (login.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Логин обязателен");
        }

        if (login.length() < 5 || login.length() > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Логин должен быть от 5 до 30 символов");
        }

        if (login.contains(" ")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Логин не должен содержать пробелы");
        }

        if (!login.matches("^[A-Za-z0-9_.]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Логин может содержать только латинские буквы, цифры, _ и .");
        }

        if (password.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Пароль обязателен");
        }

        if (password.length() < 8 || password.length() > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Пароль должен быть от 8 до 50 символов");
        }

        if (name.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Имя обязательно");
        }

        if (surname.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Фамилия обязательна");
        }

        if (phoneNum.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Телефон обязателен");
        }

        if (userService.findByLogin(login) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Такой логин уже занят");
        }

        User user = UserMapper.fromRegistrationRequest(request);
        user.setLogin(login);
        user.setPassword(password);
        user.setName(name);
        user.setSurname(surname);
        user.setPhoneNum(phoneNum);

        userService.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {

        String login = request.getLogin() == null ? "" : request.getLogin().trim();
        String password = request.getPassword() == null ? "" : request.getPassword().trim();

        if (login.isEmpty() || password.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Введите логин и пароль");
        }

        User user = userService.findByLogin(login);

        if (user == null || !userService.matchesPassword(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный логин или пароль");
        }

        String token = jwtService.generateToken(user.getId());
        return new AuthResponse(token);
    }

}

