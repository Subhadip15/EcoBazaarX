package com.SignupForm.responses;

import com.SignupForm.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * UserResponse is a DTO (Data Transfer Object) used to send user data
 * in API responses without exposing sensitive information like password or OTP.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;        // User ID
    private String name;    // User name
    private String email;   // User email
    private String phone;   // User phone
    private Role role;      // User role (e.g., USER, ADMIN)

    // You can add extra fields in the future, like:
    // private LocalDateTime createdAt;
    // private LocalDateTime lastLogin;
}
