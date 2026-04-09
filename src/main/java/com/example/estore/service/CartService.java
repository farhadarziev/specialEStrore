package com.example.estore.service;


import com.example.estore.entity.Cart;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CartService {
    private final Map<Long, Cart> carts = new HashMap<>();

    public Cart getCart(Long userId) {
        return carts.computeIfAbsent(userId, id -> new Cart());
    }

    public void addToCart(Long userId, Long productId) {
        Cart cart = getCart(userId);
        cart.addProduct(productId);
    }

    public void minusProduct(Long userId, Long productId) {
        Cart cart = getCart(userId);
        cart.minusProduct(productId);
    }
    public void removeProduct(Long userId, Long productId) {
        Cart cart = getCart(userId);
        cart.removeProduct(productId);
    }


    public void clearCart(Long userId) {
        Cart cart = getCart(userId);
        cart.getItems().clear();
    }


}
