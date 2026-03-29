package com.example.estore.mapper;


import  com.example.estore.dto.OrderItemResponse;
import  com.example.estore.model.OrderItem;

public class OrderItemMapper {

    public static OrderItemResponse toResponse(OrderItem item) {
        OrderItemResponse r = new OrderItemResponse();
        r.setProductId(item.getProductId());
        r.setProductName(item.getProductName());
        r.setQuantity(item.getQuantity());
        r.setPrice(item.getPrice());
        return r;
    }
}
