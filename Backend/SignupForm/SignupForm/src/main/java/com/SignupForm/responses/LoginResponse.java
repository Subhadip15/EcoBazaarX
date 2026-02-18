package com.SignupForm.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * LoginResponse contains JWT token and user info
 */
@Getter
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private UserResponse user;  // include user info in response
}
