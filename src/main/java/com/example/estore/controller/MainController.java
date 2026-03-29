package com.example.estore.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/")              // Главная страница
    public String home() {
        return "main"; // ищет templates/index.html
    }

    @GetMapping("/about")         // О компании
    public String about() {
        return "about"; // ищет templates/about.html
    }
}
