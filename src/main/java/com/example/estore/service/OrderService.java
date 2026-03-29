package com.example.estore.service;

import com.example.estore.dto.OrderResponse;
import com.example.estore.mapper.OrderMapper;
import com.example.estore.model.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class OrderService {

    private final List<Order> orders = new ArrayList<>();
    private Long idCounter = 1L;

    private final  CartService cartService;
    private final ProductService productService;

    public OrderService(CartService cartService, ProductService productService) {
        this.cartService = cartService;
        this.productService = productService;
    }


    // 🔥 СОЗДАНИЕ ЗАКАЗА ИЗ КОРЗИНЫ
    public void createFromCart(Long userId) {

        Cart cart = cartService.getCart(userId);

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setId(idCounter++);
        order.setUserId(userId);
        order.setStatus("CREATED");
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> items = new ArrayList<>();
        int total = 0;

        for (CartItem ci : cart.getItems()) {
            Product p = productService.findById(ci.getProductId());

            OrderItem oi = new OrderItem();
            oi.setProductId(p.getId());
            oi.setProductName(p.getName());
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(p.getPrice());

            items.add(oi);
            total += p.getPrice() * ci.getQuantity();
        }


        order.setItems(items);
        order.setTotalPrice(total);

        orders.add(order);

        cartService.clearCart(userId);
    }

    // 🔥 ДЛЯ ПРОФИЛЯ
    public List<OrderResponse> findResponsesByUserId(Long userId) {
        return orders.stream()
                .filter(o -> o.getUserId().equals(userId))
                .map(OrderMapper::toResponse)
                .toList();
    }
}
