package com.example.estore.service;

import com.example.estore.model.User;
import com.example.estore.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
   private final UserRepository userRepository;

   public UserService(UserRepository userRepository) {
       this.userRepository = userRepository;
   }

    public User register(User user) {
        System.out.println("REGISTER: " + user.getLogin());
        return userRepository.save(user);
    }

    public User findByLogin(String login) {
        return userRepository.findByLogin(login).orElse(null);
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

}
