package com.SignupForm.controller;

import com.SignupForm.entity.Role;
import com.SignupForm.entity.Users;
import com.SignupForm.requests.LoginRequest;
import com.SignupForm.requests.SignupRequest;
import com.SignupForm.responses.LoginResponse;
import com.SignupForm.responses.UserResponse;
import com.SignupForm.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/user")
public class UsersController {

    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }

    // ================= SIGNUP =================
    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            // Map SignupRequest → Users entity
            Users user = new Users();
            user.setName(signupRequest.getName());
            user.setEmail(signupRequest.getEmail());
            user.setPassword(signupRequest.getPassword());
            user.setPhone(signupRequest.getPhone());
            user.setRole(Role.USER);

            // Save user
            Users savedUser = userService.addUser(user);

            // Generate JWT token immediately after signup
            String token = userService.generateTokenForUser(savedUser);

            // Map user entity → UserResponse
            UserResponse userResponse = mapToUserResponse(savedUser);

            // Create a combined response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("token", token);
            response.put("user", userResponse);

            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }


    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Generate JWT token
            String token = userService.loginUser(loginRequest);

            // Get user info
            Users user = userService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create UserResponse
            UserResponse userResponse = mapToUserResponse(user);

            // Create LoginResponse
            LoginResponse loginResponse = new LoginResponse(token, userResponse);

            return ResponseEntity.ok(loginResponse);

        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }
    }


    // ================= FORGOT PASSWORD =================
    @PostMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        String response = userService.forgotPassword(email);
        Map<String, String> result = new HashMap<>();
        result.put("message", response);
        return ResponseEntity.ok(result);
    }

    // ================= RESET PASSWORD =================
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword) {

        String response = userService.resetPassword(email, otp, newPassword);
        Map<String, String> result = new HashMap<>();
        result.put("message", response);
        return ResponseEntity.ok(result);
    }

    // ================= FIND USER =================
    @GetMapping("/find")
    public ResponseEntity<?> findByEmail(@RequestParam String email) {
        var userOptional = userService.findByEmail(email);

        if (userOptional.isPresent()) {
            return ResponseEntity.ok(mapToUserResponse(userOptional.get()));
        }

        Map<String, String> error = new HashMap<>();
        error.put("error", "User not found");
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // ================= HELPER =================
    private UserResponse mapToUserResponse(Users user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole()
        );
    }
}
