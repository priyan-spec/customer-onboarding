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

import com.onboarding.backend.dto.CreateTaskRequest;
import com.onboarding.backend.dto.MessageResponse;
import com.onboarding.backend.dto.TaskResponse;
import com.onboarding.backend.dto.UpdateTaskRequest;
import com.onboarding.backend.service.TaskService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

	private final TaskService taskService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('PROJECT_MANAGER')")
	@Operation(summary = "Create task", description = "Creates a task for a project and assigns it to a project team member.")
	public MessageResponse createTask(@Valid @RequestBody CreateTaskRequest request) {
		return taskService.createTask(request);
	}

	@PutMapping("/{taskId}")
	@PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'TEAM_MEMBER')")
	@Operation(summary = "Update task", description = "Managers can update task fields; team members can update status only.")
	public MessageResponse updateTask(@PathVariable Long taskId, @Valid @RequestBody UpdateTaskRequest request) {
		return taskService.updateTask(taskId, request);
	}

	@DeleteMapping("/{taskId}")
	@PreAuthorize("hasRole('PROJECT_MANAGER')")
	@Operation(summary = "Delete task", description = "Deletes a task from a project.")
	public MessageResponse deleteTask(@PathVariable Long taskId) {
		return taskService.deleteTask(taskId);
	}

	@GetMapping("/assignee/{userId}")
	@PreAuthorize("hasRole('TEAM_MEMBER')")
	@Operation(summary = "Get tasks by assignee", description = "Returns tasks assigned to the authenticated team member.")
	public List<TaskResponse> getTasksByAssignee(@PathVariable Long userId) {
		return taskService.getTasksByAssignee(userId);
	}

	@GetMapping("/project/{projectId}")
	@PreAuthorize("hasAnyRole('CUSTOMER', 'PROJECT_MANAGER')")
	@Operation(summary = "Get tasks by project", description = "Returns tasks for a project.")
	public List<TaskResponse> getTasksByProject(@PathVariable Long projectId) {
		return taskService.getTasksByProject(projectId);
	}
}
