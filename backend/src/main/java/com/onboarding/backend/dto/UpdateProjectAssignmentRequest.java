package com.onboarding.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProjectAssignmentRequest(
	@NotBlank @Size(max = 120) String assignedRole
) {
}
