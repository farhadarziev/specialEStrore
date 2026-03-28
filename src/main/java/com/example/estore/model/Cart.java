package com.example.estore.model;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Cart {

    private List<CartItem> items = new ArrayList<>();

    public List<CartItem> getItems() {
        return items;
    }

    public void addProduct(Long productId) {
        for (CartItem item : items) {
            if (item.getProductId().equals(productId)) {
                item.increment();
                return;
            }
        }
        items.add(new CartItem(productId, 1));
    }

    public void minusProduct(Long productId) {
        for (CartItem item : items) {
            if (item.getProductId().equals(productId)) {
                if (item.getQuantity() > 1) {
                    item.decrement();
                }
                return;
            }
        }
    }

    public void removeProduct(Long productId) {
        Iterator<CartItem> iterator = items.iterator();
        while (iterator.hasNext()) {
            if (iterator.next().getProductId().equals(productId)) {
                iterator.remove();
                return;
            }
        }
    }
}



