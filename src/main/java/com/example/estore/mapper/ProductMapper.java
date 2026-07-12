package com.example.estore.mapper;

import com.example.estore.dto.ProductRequest;
import com.example.estore.dto.ProductResponse;
import com.example.estore.entity.Product;

public class ProductMapper {

    private ProductMapper() {
    }

    public static ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setCategory(product.getCategory());
        response.setPrice(product.getPrice());
        response.setImage(product.getImage());
        return response;
    }

    public static Product toEntity(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setImage(request.getImage());
        return product;
    }

    public static void updateEntity(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setImage(request.getImage());
    }
}