package com.example.estore.mapper;

import com.example.estore.dto.AdminOrderResponse;
import com.example.estore.entity.Order;

public class AdminOrderMapper {

    private AdminOrderMapper() {
    }

    public static AdminOrderResponse toResponse(Order order) {
        AdminOrderResponse response = new AdminOrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUser().getId());
        response.setUserLogin(order.getUser().getLogin());
        response.setTotalPrice(order.getTotalPrice());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        response.setItems(
                order.getItems().stream()
                        .map(OrderItemMapper::toResponse)
                        .toList()
        );
        return response;
    }
}