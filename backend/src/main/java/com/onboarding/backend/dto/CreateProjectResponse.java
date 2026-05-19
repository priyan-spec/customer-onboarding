package com.onboarding.backend.dto;

import com.onboarding.backend.entity.ProjectStatus;

public record CreateProjectResponse(
	Long projectId,
	Long managerId,
	ProjectStatus status,
	String message
) {
}
