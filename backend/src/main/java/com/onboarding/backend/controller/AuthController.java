package com.onboarding.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.onboarding.backend.dto.AuthResponse;
import com.onboarding.backend.dto.LoginRequest;
import com.onboarding.backend.dto.MessageResponse;
import com.onboarding.backend.dto.RegisterRequest;
import com.onboarding.backend.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Register a user", description = "Registers CUSTOMER, PROJECT_MANAGER, or TEAM_MEMBER users.")
	public MessageResponse register(@Valid @RequestBody RegisterRequest request) {
		return authService.register(request);
	}

	@PostMapping("/login")
	@Operation(summary = "Login user", description = "Authenticates a user and returns a JWT bearer token.")
	public AuthResponse login(@Valid @RequestBody LoginRequest request) {
		return authService.login(request);
	}
}
