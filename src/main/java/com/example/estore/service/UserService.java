package com.example.estore.service;

import com.example.estore.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final List<User> users = new ArrayList<>();
    private Long idCounter = 1L;

    public User register(User user) {
        user.setId(idCounter++);
        users.add(user);
        System.out.println("REGISTER: " + user.getLogin() + " id=" + user.getId());

        return user;
    }

    public User findByLogin(String login) {
        return users.stream()
                .filter(u -> u.getLogin().equals(login))
                .findFirst()
                .orElse(null);
    }

    public User findById(Long id) {
        return users.stream()
                .filter( u -> u.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

}
