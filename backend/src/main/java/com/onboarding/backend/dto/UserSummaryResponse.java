package com.onboarding.backend.dto;

public record UserSummaryResponse(
	Long id,
	String name,
	String email
) {
}
