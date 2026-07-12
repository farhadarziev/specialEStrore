package com.example.estore.service;

import com.example.estore.dto.ProductRequest;
import com.example.estore.dto.ProductResponse;
import com.example.estore.entity.Product;
import com.example.estore.mapper.ProductMapper;
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

    public List<ProductResponse> findProductResponses(String category, String q) {
        return findProducts(category, q)
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    public ProductResponse findResponseById(Long id) {
        return ProductMapper.toResponse(findById(id));
    }


    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->  new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    public List<ProductResponse> findAllResponses() {
        return productRepository.findAll()
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    public ProductResponse create(ProductRequest request) {
        validateRequest(request);

        Product product = ProductMapper.toEntity(request);
        Product savedProduct = productRepository.save(product);

        return ProductMapper.toResponse(savedProduct);
    }

    public ProductResponse update(Long id, ProductRequest request) {
        validateRequest(request);

        Product product = findById(id);
        ProductMapper.updateEntity(product, request);

        Product savedProduct = productRepository.save(product);
        return ProductMapper.toResponse(savedProduct);
    }

    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }

        productRepository.deleteById(id);
    }

    private void validateRequest(ProductRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is required");
        }

        if (request.getName() == null || request.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product name is required");
        }

        if (request.getCategory() == null || request.getCategory().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product category is required");
        }

        if (request.getPrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product price must be greater than zero");
        }
    }
}
