package com.SignupForm.dto.order;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutRequest {

    private Long addressId;       // ID of the Address entity
    private String address;       // Optional plain text address from frontend
    private String paymentMethod; // e.g., "COD" or "CARD"
    private String fullName;      // Customer full name
    private String email;         // Optional email if different from user

    // Optional helper
    public String getAddress() {
        if (address != null && !address.isBlank()) {
            return address.trim();
        }
        return addressId != null ? "Address ID: " + addressId : "";
    }
}
