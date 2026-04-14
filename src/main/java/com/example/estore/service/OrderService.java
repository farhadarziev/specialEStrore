package com.example.estore.service;

import com.example.estore.dto.OrderResponse;
import com.example.estore.mapper.OrderMapper;
import com.example.estore.entity.*;
import com.example.estore.repository.OrderRepository;
import com.example.estore.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class OrderService {

    private final  CartService cartService;
    private final ProductService productService;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public OrderService(CartService cartService, ProductService productService, UserRepository userRepository, OrderRepository orderRepository) {
        this.cartService = cartService;
        this.productService = productService;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }
    @Transactional
    public void createFromCart(Long userId) {

        Cart cart = cartService.getCart(userId);

        if (cart.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("CREATED");
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> items = new ArrayList<>();
        int total = 0;

        for (CartItem cartItem : cart.getItems()) {
            Product product = productService.findById(cartItem.getProductId());

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());

            items.add(orderItem);

            total += product.getPrice() * cartItem.getQuantity();
        }
        order.setItems(items);
        order.setTotalPrice(total);

       orderRepository.save(order);
       cartService.clearCart(userId);
    }

    // 🔥 ДЛЯ ПРОФИЛЯ
    public List<OrderResponse> findResponsesByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(OrderMapper::toResponse)
                .toList();
    }
}
