package com.SignupForm.repository;

import com.SignupForm.entity.Order;
import com.SignupForm.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByEmail(String email);  // Fetch orders for a user
    List<Order> findByUser(Users user);     // Fetch orders by user entity
}