package com.onboarding.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onboarding.backend.dto.AuthResponse;
import com.onboarding.backend.dto.LoginRequest;
import com.onboarding.backend.dto.MessageResponse;
import com.onboarding.backend.dto.RegisterRequest;
import com.onboarding.backend.entity.AppUser;
import com.onboarding.backend.exception.BadRequestException;
import com.onboarding.backend.repository.UserRepository;
import com.onboarding.backend.security.AppUserDetails;
import com.onboarding.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;

	@Transactional
	public MessageResponse register(RegisterRequest request) {
		if (userRepository.existsByEmail(request.email())) {
			throw new BadRequestException("Email is already registered");
		}

		AppUser user = AppUser.builder()
			.email(request.email())
			.password(passwordEncoder.encode(request.password()))
			.role(request.role())
			.name(request.name())
			.build();

		userRepository.save(user);
		return new MessageResponse("User Registered Successfully");
	}

	public AuthResponse login(LoginRequest request) {
		authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(request.email(), request.password())
		);

		AppUser user = userRepository.findByEmail(request.email())
			.orElseThrow(() -> new BadRequestException("Invalid email or password"));
		String token = jwtService.generateToken(new AppUserDetails(user));

		return new AuthResponse(token, user.getId(), user.getRole(), user.getName());
	}
}
