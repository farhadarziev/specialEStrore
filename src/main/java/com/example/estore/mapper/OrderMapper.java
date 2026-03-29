package com.example.estore.mapper;

import  com.example.estore.dto.OrderResponse;
import  com.example.estore.model.Order;

import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderResponse toResponse(Order order) {
        OrderResponse r = new OrderResponse();
        r.setId(order.getId());
        r.setTotalPrice(order.getTotalPrice());
        r.setStatus(order.getStatus());
        r.setCreatedAt(order.getCreatedAt());

        r.setItems(
                order.getItems().stream()
                        .map(OrderItemMapper::toResponse)
                        .collect(Collectors.toList())
        );

        return r;
    }
}
