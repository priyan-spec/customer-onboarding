package com.onboarding.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.onboarding.backend.dto.MessageResponse;
import com.onboarding.backend.dto.ProjectAssignmentRequest;
import com.onboarding.backend.dto.ProjectAssignmentResponse;
import com.onboarding.backend.dto.UpdateProjectAssignmentRequest;
import com.onboarding.backend.service.ProjectAssignmentService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/project-assignments")
@RequiredArgsConstructor
public class ProjectAssignmentController {

	private final ProjectAssignmentService projectAssignmentService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('PROJECT_MANAGER')")
	@Operation(summary = "Assign team member to project", description = "Adds a team member to a project assignment list.")
	public MessageResponse assignTeamMember(@Valid @RequestBody ProjectAssignmentRequest request) {
		return projectAssignmentService.assignTeamMember(request);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('PROJECT_MANAGER')")
	@Operation(summary = "Update project assignment", description = "Updates the assigned role for a team member.")
	public MessageResponse updateAssignment(
		@PathVariable Long id,
		@Valid @RequestBody UpdateProjectAssignmentRequest request
	) {
		return projectAssignmentService.updateAssignment(id, request);
	}

	@GetMapping("/project/{projectId}")
	@PreAuthorize("hasRole('PROJECT_MANAGER')")
	@Operation(summary = "Get assigned team members", description = "Returns assigned team members for a project.")
	public List<ProjectAssignmentResponse> getAssignedTeamMembers(@PathVariable Long projectId) {
		return projectAssignmentService.getAssignedTeamMembers(projectId);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('PROJECT_MANAGER')")
	@Operation(summary = "Delete project assignment", description = "Removes a team member from a project.")
	public MessageResponse deleteAssignment(@PathVariable Long id) {
		return projectAssignmentService.deleteAssignment(id);
	}
}
