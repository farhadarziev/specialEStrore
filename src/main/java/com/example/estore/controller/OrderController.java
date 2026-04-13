package com.example.estore.controller;



import com.example.estore.dto.OrderResponse;
import com.example.estore.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    private Long getUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof Long userId) {
            return userId;
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    @PostMapping("/create")
    public void createOrder() {
        orderService.createFromCart(getUserId());
    }

    @GetMapping("/my")
    public List<OrderResponse> myOrders() {
        return orderService.findResponsesByUserId(getUserId());
    }
}