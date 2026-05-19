package com.onboarding.backend.dto;

import java.time.LocalDate;

public record ProjectAssignmentResponse(
	Long id,
	Long teamMemberId,
	String name,
	String email,
	String assignedRole,
	LocalDate assignedDate
) {
}
