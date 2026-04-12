package com.example.estore.service;

import com.example.estore.entity.*;
import com.example.estore.repository.CartItemRepository;
import com.example.estore.repository.ProductRepository;
import com.example.estore.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Cart getCart(Long userId) {
        List<CartItemEntity> entities = cartItemRepository.findByUserIdOrderByProductIdAsc(userId);

        Cart cart = new Cart();
        for (CartItemEntity entity : entities) {
            cart.getItems().add(
                    new CartItem(
                            entity.getProduct().getId(),
                            entity.getQuantity()
                    )
            );
        }
        return cart;
    }
    @Transactional
    public void addToCart(Long userId, Long productId) {
        CartItemEntity item = cartItemRepository
                .findByUserIdAndProductId(userId, productId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

                    Product product = productRepository.findById(productId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

                    CartItemEntity newItem = new CartItemEntity();
                    newItem.setUser(user);
                    newItem.setProduct(product);
                    newItem.setQuantity(0);
                    return newItem;
                });

        item.setQuantity(item.getQuantity() + 1);
        cartItemRepository.save(item);
    }

    @Transactional
    public void minusProduct(Long userId, Long productId) {
        CartItemEntity item = cartItemRepository
                .findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
            cartItemRepository.save(item);
        }
    }

    @Transactional
    public void removeProduct(Long userId, Long productId) {
        CartItemEntity item = cartItemRepository
                .findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(Long userId) {
        List<CartItemEntity> items = cartItemRepository.findByUserIdOrderByProductIdAsc(userId);
        cartItemRepository.deleteAll(items);
    }
}
