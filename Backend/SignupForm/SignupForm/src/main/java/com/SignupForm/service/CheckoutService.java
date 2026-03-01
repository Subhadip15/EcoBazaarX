package com.SignupForm.service;

import com.SignupForm.dto.order.CheckoutRequest;
import com.SignupForm.dto.order.OrderItemResponse;
import com.SignupForm.dto.order.OrderResponse;
import com.SignupForm.entity.*;
import com.SignupForm.repository.*;
import com.SignupForm.util.AppConstants;
import com.SignupForm.util.OrderIdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CheckoutService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AddressRepository addressRepository;

    // ================= PLACE ORDER / CHECKOUT =================
    public OrderResponse checkout(Long userId, CheckoutRequest request) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        Order order = Order.builder()
                .orderNumber(OrderIdGenerator.generateOrderId())
                .user(user)
                .address(address.getFullAddress())
                .status(AppConstants.ORDER_PROCESSING)
                .orderDate(LocalDateTime.now())
                .paymentMethod(request.getPaymentMethod())
                .customerName(request.getFullName())
                .email(request.getEmail() != null ? request.getEmail() : user.getEmail())
                .totalAmount(0.0)
                .totalEmission(0.0)
                .shipping(0.0)
                .build();

        double subtotal = 0.0;
        double totalEmission = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getCartItems()) {
            double price = cartItem.getProduct().getPrice();
            int quantity = cartItem.getQuantity();
            double emission = cartItem.getProduct().getEmission() != null
                    ? cartItem.getProduct().getEmission() : 0.5;
            double itemEmission = emission * quantity;

            subtotal += price * quantity;
            totalEmission += itemEmission;

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .price(price)
                    .quantity(quantity)
                    .emission(itemEmission)
                    .build();

            orderItems.add(orderItem);
        }

        double shipping = subtotal > 100 ? 0.0 : 7.5;
        order.setTotalAmount(subtotal + shipping);
        order.setTotalEmission(totalEmission);
        order.setShipping(shipping);
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        cart.getCartItems().clear();
        cartRepository.save(cart);

        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for (OrderItem oi : orderItems) {
            itemResponses.add(OrderItemResponse.builder()
                    .productId(oi.getProduct().getId())
                    .productName(oi.getProduct().getName())
                    .quantity(oi.getQuantity())
                    .price(oi.getPrice())
                    .subtotal(oi.getPrice() * oi.getQuantity())
                    .emission(oi.getEmission())
                    .build());
        }

        return OrderResponse.builder()
                .orderId(savedOrder.getId())
                .orderNumber(savedOrder.getOrderNumber())
                .status(savedOrder.getStatus())
                .totalAmount(savedOrder.getTotalAmount())
                .totalEmission(savedOrder.getTotalEmission())
                .shipping(savedOrder.getShipping())
                .orderDate(savedOrder.getOrderDate())
                .paymentMethod(savedOrder.getPaymentMethod())
                .customerName(savedOrder.getCustomerName())
                .email(savedOrder.getEmail())
                .address(savedOrder.getAddress())
                .items(itemResponses)
                .build();
    }

    // ================= PAY ORDER (SIMULATION) =================
    public OrderResponse payOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        order.setStatus(AppConstants.ORDER_PLACED);
        orderRepository.save(order);

        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for (OrderItem oi : order.getOrderItems()) {
            itemResponses.add(OrderItemResponse.builder()
                    .productId(oi.getProduct().getId())
                    .productName(oi.getProduct().getName())
                    .quantity(oi.getQuantity())
                    .price(oi.getPrice())
                    .subtotal(oi.getPrice() * oi.getQuantity())
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