package com.SignupForm.service;

import java.util.Optional;

import com.SignupForm.entity.Users;
import com.SignupForm.repository.UsersRepo;
import com.SignupForm.requests.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UsersRepo usersRepo;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Add user with hashed password
    public Users addUser(Users user) {
        // Hash the password before saving
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return usersRepo.save(user);
    }

    // Login user by verifying password hash
    public Boolean loginUser(LoginRequest loginRequest) {
        Optional<Users> userOpt = usersRepo.findByEmail(loginRequest.getEmail()); // use email!
        if (userOpt.isEmpty()) return false;

        Users user = userOpt.get();
        // Compare hashed password
        return passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
    }
}
