package com.onboarding.backend.dto;

import com.onboarding.backend.entity.Role;

public record AuthResponse(
	String token,
	Long userId,
	Role role,
	String name
) {
}
