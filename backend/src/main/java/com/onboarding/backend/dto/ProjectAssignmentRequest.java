package com.onboarding.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProjectAssignmentRequest(
	@NotNull Long projectId,
	@NotNull Long teamMemberId,
	@NotBlank @Size(max = 120) String assignedRole
) {
}
