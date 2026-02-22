package com.SignupForm.service;

import com.SignupForm.entity.Product;
import com.SignupForm.repository.ProductRepo;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    // Repository for performing database operations on Product entity
    private final ProductRepo productRepo;

    // Constructor injection of ProductRepo
    public ProductService(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }

    // Retrieve all products from the database
    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    // Retrieve a product by its ID
    public Optional<Product> getProductById(Long id) {
        return productRepo.findById(id);
    }

    // Save or update a product in the database
    public Product saveProduct(Product product) {
        return productRepo.save(product);
    }

    // Delete a product by its ID
    public void deleteProduct(Long id) {
        productRepo.deleteById(id);
    }

    // Search products based on a keyword
    public List<Product> search(String keyword) {
        return productRepo.searchProducts(keyword);
    }
}
