package com.onboarding.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.onboarding.backend.dto.CreateProjectResponse;
import com.onboarding.backend.dto.ProjectDetailResponse;
import com.onboarding.backend.dto.ProjectSummaryResponse;
import com.onboarding.backend.entity.Priority;
import com.onboarding.backend.service.ProjectService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

	private final ProjectService projectService;

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Create onboarding project", description = "Creates a project, uploads documents, and assigns the least-loaded manager.")
	public CreateProjectResponse createProject(
		@RequestParam @NotBlank @Size(max = 160) String title,
		@RequestParam @NotBlank @Size(max = 1000) String description,
		@RequestParam @NotBlank String requirements,
		@RequestParam @NotNull Priority priority,
		@RequestParam @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate deadline,
		@RequestParam(required = false) List<MultipartFile> documents
	) {
		return projectService.createProject(title, description, requirements, priority, deadline, documents);
	}

	@GetMapping("/customer/{userId}")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Get customer projects", description = "Returns all projects created by the authenticated customer.")
	public List<ProjectSummaryResponse> getCustomerProjects(@PathVariable Long userId) {
		return projectService.getCustomerProjects(userId);
	}

	@GetMapping("/manager/{managerId}")
	@PreAuthorize("hasRole('PROJECT_MANAGER')")
	@Operation(summary = "Get manager projects", description = "Returns all projects assigned to the authenticated project manager.")
	public List<ProjectSummaryResponse> getManagerProjects(@PathVariable Long managerId) {
		return projectService.getManagerProjects(managerId);
	}

	@GetMapping("/{projectId}")
	@PreAuthorize("hasAnyRole('CUSTOMER', 'PROJECT_MANAGER', 'TEAM_MEMBER')")
	@Operation(summary = "Get single project", description = "Returns project details, requirements, and uploaded document metadata.")
	public ProjectDetailResponse getProject(@PathVariable Long projectId) {
		return projectService.getProject(projectId);
	}
}
