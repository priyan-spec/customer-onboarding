package com.onboarding.backend.dto;

import com.onboarding.backend.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
	@Email @NotBlank String email,
	@NotBlank @Size(min = 6, max = 100) String password,
	@NotNull Role role,
	@NotBlank @Size(max = 120) String name
) {
}
