package com.example.estore.service;

import com.example.estore.entity.User;
import com.example.estore.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
   private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
       this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        System.out.println("REGISTER: " + user.getLogin());
        return userRepository.save(user);
    }

    public User findByLogin(String login) {
        return userRepository.findByLogin(login).orElse(null);
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    public boolean matchesPassword(String rawPassword, String encodedPassword) {
        // rawPassword — пароль, который ввёл пользователь
        // encodedPassword — хэш из базы данных
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

}
