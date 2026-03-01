package com.SignupForm.controller;

import com.SignupForm.dto.order.CheckoutRequest;
import com.SignupForm.dto.order.OrderResponse;
import com.SignupForm.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ================= PLACE ORDER =================
    @PostMapping("/place")
    public ResponseEntity<OrderResponse> placeOrder(
            Principal principal,
            @RequestBody CheckoutRequest request
    ) {
        String email = principal.getName(); // email from JWT
        OrderResponse order = orderService.placeOrder(email, request);
        return ResponseEntity.ok(order);
    }

    // ================= GET ALL USER ORDERS =================
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(Principal principal) {
        String email = principal.getName();
        List<OrderResponse> orders = orderService.getOrdersForUser(email);
        return ResponseEntity.ok(orders);
    }

    // ================= GET SINGLE ORDER =================
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(
            @PathVariable Long orderId,
            Principal principal
    ) {
        String email = principal.getName();
        OrderResponse order = orderService.getOrderById(orderId, email);
        return ResponseEntity.ok(order);
    }
}