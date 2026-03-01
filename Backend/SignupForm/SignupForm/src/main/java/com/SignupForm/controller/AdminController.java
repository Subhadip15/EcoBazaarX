package com.SignupForm.controller;

import com.SignupForm.dto.admin.StatsResponse;
import com.SignupForm.enums.Role;
import com.SignupForm.entity.Users;
import com.SignupForm.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<Users>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deleteUser(id));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Users> changeRole(
            @PathVariable Long id,
            @RequestParam Role role
    ) {
        return ResponseEntity.ok(adminService.changeUserRole(id, role));
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        return ResponseEntity.ok(
                StatsResponse.builder()
                        .totalUsers(adminService.getTotalUsers())
                        .totalAdmins(adminService.getTotalAdmins())
                        .totalNormalUsers(adminService.getTotalNormalUsers())
                        .build()
        );
    }
}