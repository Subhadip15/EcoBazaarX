package com.SignupForm.service;

import com.SignupForm.entity.Role;
import com.SignupForm.entity.Users;
import com.SignupForm.repository.UsersRepo;
import com.SignupForm.requests.LoginRequest;
import com.SignupForm.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    private final UsersRepo usersRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public UserService(UsersRepo usersRepo,
                       BCryptPasswordEncoder passwordEncoder,
                       EmailService emailService,
                       JwtUtil jwtUtil) {
        this.usersRepo = usersRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    // ================= SIGNUP =================
    public Users addUser(Users user) {

        if (user.getEmail() == null || user.getEmail().isEmpty())
            throw new RuntimeException("Email cannot be null or empty");

        if (user.getPassword() == null || user.getPassword().isEmpty())
            throw new RuntimeException("Password cannot be null or empty");

        if (usersRepo.findByEmail(user.getEmail()).isPresent())
            throw new RuntimeException("Email already exists");

        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);

        return usersRepo.save(user);
    }

    // ================= LOGIN =================
    public String loginUser(LoginRequest loginRequest) {

        if (loginRequest.getEmail() == null || loginRequest.getEmail().isEmpty())
            throw new RuntimeException("Email cannot be empty");

        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty())
            throw new RuntimeException("Password cannot be empty");

        Users user = usersRepo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");

        // Generate JWT token
        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }

    // ================= FIND USER =================
    public Optional<Users> findByEmail(String email) {
        if (email == null || email.isEmpty())
            throw new RuntimeException("Email cannot be empty");

        return usersRepo.findByEmail(email);
    }

    // ================= FORGOT PASSWORD =================
    public String forgotPassword(String email) {
        if (email == null || email.isEmpty())
            return "Email cannot be empty";

        Optional<Users> userOpt = usersRepo.findByEmail(email);
        if (userOpt.isEmpty()) return "User not found";

        Users user = userOpt.get();
        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        usersRepo.save(user);

        emailService.sendOtpEmail(email, otp);
        return "OTP sent to email successfully";
    }

    // ================= RESET PASSWORD =================
    public String resetPassword(String email, String otp, String newPassword) {
        if (email == null || email.isEmpty())
            return "Email cannot be empty";

        if (newPassword == null || newPassword.isEmpty())
            return "New password cannot be empty";

        Optional<Users> userOpt = usersRepo.findByEmail(email);
        if (userOpt.isEmpty()) return "User not found";

        Users user = userOpt.get();

        if (user.getOtp() == null || user.getOtpExpiry() == null)
            return "No OTP requested";

        if (!user.getOtp().equals(otp)) return "Invalid OTP";
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) return "OTP expired";

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);

        usersRepo.save(user);
        return "Password reset successful";
    }

    // ================= HELPER =================
    private String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000);
    }

    // In UserService
    public String generateTokenForUser(Users user) {
        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }

}
