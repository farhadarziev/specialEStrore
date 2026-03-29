package com.example.estore.controller;



import com.example.estore.dto.OrderResponse;
import com.example.estore.model.Order;
import com.example.estore.service.OrderService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    private Long getUserId() {
        return (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // 🔥 ОФОРМИТЬ ЗАКАЗ
    @PostMapping("/create")
    public void createOrder() {
        orderService.createFromCart(getUserId());
    }

    // 🔥 МОИ ЗАКАЗЫ
    @GetMapping("/my")
    public List<OrderResponse> myOrders() {
        return orderService.findResponsesByUserId(getUserId());
    }
}
