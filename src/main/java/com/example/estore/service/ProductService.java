package com.example.estore.service;

import com.example.estore.entity.Product;
import com.example.estore.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findProducts(String category, String q) {
        List<Product> products = productRepository.findAll();

        if (category != null && !category.isBlank()) {
            products = products.stream()
                    .filter(p -> p.getCategory() != null && p.getCategory().equalsIgnoreCase(category))
                    .toList();
        }

        if (q != null && !q.isBlank()) {
            String search = q.trim().toLowerCase();

            products = products.stream()
                    .filter(p -> p.getName() != null && p.getName().toLowerCase().contains(search))
                    .toList();
        }

        return products;
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->  new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }
}
