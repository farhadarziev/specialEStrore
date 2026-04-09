package com.example.estore.controller;


import com.example.estore.entity.Cart;
import com.example.estore.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
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

    @PostMapping("/add/{productId}")
    public void addToCart(@PathVariable Long productId) {
        cartService.addToCart(getUserId(), productId);
    }

    @PostMapping("/minus/{productId}")
    public void minus(@PathVariable Long productId) {
        cartService.minusProduct(getUserId(), productId);
    }

    @DeleteMapping("/remove/{productId}")
    public void remove(@PathVariable Long productId) {
        cartService.removeProduct(getUserId(), productId);
    }

    @DeleteMapping
    public void clearCart() {
        cartService.clearCart(getUserId());
    }



    @GetMapping
    public Cart getCart() {
        return cartService.getCart(getUserId());
    }
}

//******************
//        import org.springframework.security.core.context.SecurityContextHolder;
//
//@PostMapping("/add/{productId}")
//public void addToCart(@PathVariable Long productId) {
//
//    Long userId = (Long) SecurityContextHolder
//            .getContext()
//            .getAuthentication()
//            .getPrincipal();
//
//    cartService.addToCart(userId, productId);
//}
//
//
//@PostMapping("/minus/{productId}")
//public void minusProduct(@PathVariable Long productId) {
//
//    Long userId = (Long) SecurityContextHolder
//            .getContext()
//            .getAuthentication()
//            .getPrincipal();
//
//    cartService.minusProduct(userId, productId);
//}
//
//@PostMapping("/remove/{productId}")
//public void removeProduct(@PathVariable Long productId) {
//
//    Long userId = (Long) SecurityContextHolder
//            .getContext()
//            .getAuthentication()
//            .getPrincipal();
//
//    cartService.removeProduct(userId, productId);
//}
//
//
//
//@GetMapping
//public Cart getCart() {
//
//    Long userId = (Long) SecurityContextHolder
//            .getContext()
//            .getAuthentication()
//            .getPrincipal();
//
//    return cartService.getCart(userId);
//}

