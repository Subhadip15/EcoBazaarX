package com.SignupForm.service;

import com.SignupForm.dto.order.CheckoutRequest;
import com.SignupForm.dto.order.OrderItemResponse;
import com.SignupForm.dto.order.OrderResponse;
import com.SignupForm.entity.*;
import com.SignupForm.repository.*;
import com.SignupForm.util.AppConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    // ================= PLACE ORDER =================
    @Transactional
    public OrderResponse placeOrder(String email, CheckoutRequest request) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        String resolvedAddress;
        if (request.getAddressId() != null) {
            Address addressEntity = addressRepository.findById(request.getAddressId())
                    .orElseThrow(() -> new RuntimeException("Address not found"));
            resolvedAddress = addressEntity.getStreet() + ", " + addressEntity.getCity() + ", " +
                    addressEntity.getState() + " - " + addressEntity.getZipCode();
        } else if (request.getAddress() != null && !request.getAddress().isBlank()) {
            resolvedAddress = request.getAddress().trim();
        } else {
            throw new RuntimeException("Address is required");
        }

        double subtotal = 0.0;
        double totalEmission = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem ci : cart.getCartItems()) {
            double price = ci.getProduct().getPrice();
            int quantity = ci.getQuantity();
            double itemEmission = ci.getProduct().getEmission() * quantity;

            subtotal += price * quantity;
            totalEmission += itemEmission;

            OrderItem orderItem = OrderItem.builder()
                    .productId(ci.getProduct().getId())
                    .productName(ci.getProduct().getName())
                    .price(price)
                    .quantity(quantity)
                    .subtotal(price * quantity)
                    .emission(itemEmission)
                    .build();

            orderItems.add(orderItem);
        }

        double shipping = subtotal > 100 ? 0.0 : 7.5;

        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .status(AppConstants.ORDER_PROCESSING)
                .totalAmount(subtotal + shipping)
                .totalEmission(totalEmission)
                .shipping(shipping)
                .paymentMethod(request.getPaymentMethod())
                .customerName(request.getFullName())
                .email(request.getEmail() != null ? request.getEmail() : user.getEmail())
                .address(resolvedAddress)
                .orderNumber(AppConstants.ORDER_PREFIX + System.currentTimeMillis())
                .orderItems(orderItems)
                .build();

        orderRepository.save(order);

        // Clear cart
        cart.getCartItems().clear();
        cartRepository.save(cart);

        // Map to DTO
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for (OrderItem oi : orderItems) {
            itemResponses.add(OrderItemResponse.builder()
                    .productId(oi.getProductId())
                    .productName(oi.getProductName())
                    .quantity(oi.getQuantity())
                    .price(oi.getPrice())
                    .subtotal(oi.getSubtotal())
                    .emission(oi.getEmission())
                    .build());
        }

        return OrderResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .totalEmission(order.getTotalEmission())
                .shipping(order.getShipping())
                .orderDate(order.getOrderDate())
                .paymentMethod(order.getPaymentMethod())
                .customerName(order.getCustomerName())
                .email(order.getEmail())
                .address(order.getAddress())
                .items(itemResponses)
                .build();
    }

    // ================= PAY ORDER =================
    @Transactional
    public OrderResponse payOrder(Long orderId, String email) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Access denied");
        }

        order.setStatus(AppConstants.ORDER_PLACED);
        orderRepository.save(order);

        return mapToOrderResponse(order);
    }

    // ================= GET USER ORDERS =================
    public List<OrderResponse> getOrdersForUser(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orderRepository.findByUser(user)) {
            responses.add(mapToOrderResponse(order));
        }
        return responses;
    }

    // ================= GET SINGLE ORDER =================
    public OrderResponse getOrderById(Long orderId, String email) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Access denied");
        }

        return mapToOrderResponse(order);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for (OrderItem oi : order.getOrderItems()) {
            itemResponses.add(OrderItemResponse.builder()
                    .productId(oi.getProductId())
                    .productName(oi.getProductName())
                    .quantity(oi.getQuantity())
                    .price(oi.getPrice())
                    .subtotal(oi.getSubtotal())
                    .emission(oi.getEmission())
                    .build());
        }

        return OrderResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .totalEmission(order.getTotalEmission())
                .shipping(order.getShipping())
                .orderDate(order.getOrderDate())
                .paymentMethod(order.getPaymentMethod())
                .customerName(order.getCustomerName())
                .email(order.getEmail())
                .address(order.getAddress())
                .items(itemResponses)
                .build();
    }
}
