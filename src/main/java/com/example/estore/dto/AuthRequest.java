package com.example.estore.dto;

public class AuthRequest {
    private String login;
    private String password;

    public AuthRequest() {  // loginRequest dto Если убрать AuthRequest:  начнёшь принимать User случайно примешь лишние поляЪ
    }

    public String getLogin() {
        return login;
    }
    public void setLogin(String login) {
        this.login = login;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
