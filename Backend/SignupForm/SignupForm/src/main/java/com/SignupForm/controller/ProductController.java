package com.SignupForm.controller;

import com.SignupForm.entity.Product;
import com.SignupForm.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api") // Base API path for product-related endpoints
public class ProductController {

    // Service layer dependency for product operations
    private final ProductService productService;

    // Constructor injection of ProductService
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Fetch all products (public access)
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Fetch a single product by ID (public access)
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Search products by keyword (public access)
    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.search(keyword));
    }

    // Create a new product (admin only)
    @PostMapping("/product")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        try {
            Product savedProduct = productService.saveProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct); // Return 201 Created status
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Return 500 if error occurs
        }
    }

    // Update an existing product by ID (admin only)
    @PutMapping("/product/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productService.getProductById(id).map(existingProduct -> {

            // Update product fields with new values
            existingProduct.setName(productDetails.getName());
            existingProduct.setCategory(productDetails.getCategory());
            existingProduct.setSeller(productDetails.getSeller());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setImage(productDetails.getImage());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setIsEcoFriendly(productDetails.getIsEcoFriendly());

            // Update carbon data only if provided
            if (productDetails.getCarbonData() != null) {
                existingProduct.setCarbonData(productDetails.getCarbonData());
            }

            Product updatedProduct = productService.saveProduct(existingProduct);
            return ResponseEntity.ok(updatedProduct); // Return updated product with 200 OK

        }).orElse(ResponseEntity.notFound().build()); // Return 404 if product not found
    }

    // Delete a product by ID (admin only)
    @DeleteMapping("/product/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build(); // Return 204 No Content on successful deletion
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Return 500 if error occurs
        }
    }
}
