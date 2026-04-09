package com.example.estore.mapper;


import com.example.estore.dto.RegistrationRequest;
import com.example.estore.dto.UserResponse;
import com.example.estore.entity.User;

import java.time.LocalDateTime;

public class UserMapper {

    public static User fromRegistrationRequest(RegistrationRequest dto) {
        User user = new User();
        user.setLogin(dto.getLogin());
        user.setPassword(dto.getPassword());
        user.setName(dto.getName());
        user.setSurname(dto.getSurname());
        user.setPhoneNum(dto.getPhoneNum());
        user.setRegisteredAt(LocalDateTime.now());
        return user;
    }

    public static UserResponse toUserResponse(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setLogin(user.getLogin());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setPhoneNum(user.getPhoneNum());
        dto.setRegisteredAt(user.getRegisteredAt());
        return dto;
    }
}
