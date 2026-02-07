package com.SignupForm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.SignupForm.entity.Users;
import com.SignupForm.requests.LoginRequest;
import com.SignupForm.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UsersController {

    @Autowired
    private UserService userService;

    @PostMapping("/addUser")
    public Users addUser(@RequestBody Users user) {
        return userService.addUser(user);
    }

    @PostMapping("/loginUser")
    public boolean loginUser(@RequestBody LoginRequest loginRequest) {
        return userService.loginUser(loginRequest);
    }
}
