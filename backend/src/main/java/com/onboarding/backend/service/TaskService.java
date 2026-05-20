package com.onboarding.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onboarding.backend.dto.CreateTaskRequest;
import com.onboarding.backend.dto.MessageResponse;
import com.onboarding.backend.dto.TaskResponse;
import com.onboarding.backend.dto.UpdateTaskRequest;
import com.onboarding.backend.entity.AppUser;
import com.onboarding.backend.entity.Project;
import com.onboarding.backend.entity.Role;
import com.onboarding.backend.entity.Task;
import com.onboarding.backend.entity.TaskStatus;
import com.onboarding.backend.exception.BadRequestException;
import com.onboarding.backend.exception.ForbiddenActionException;
import com.onboarding.backend.exception.ResourceNotFoundException;
import com.onboarding.backend.repository.ProjectAssignmentRepository;
import com.onboarding.backend.repository.TaskRepository;
import com.onboarding.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

	private final TaskRepository taskRepository;
	private final UserRepository userRepository;
	private final ProjectAssignmentRepository projectAssignmentRepository;
	private final ProjectService projectService;
	private final AccessControlService accessControlService;
	private final NotificationService notificationService;

	@Transactional
	public MessageResponse createTask(CreateTaskRequest request) {
		Project project = projectService.findProject(request.projectId());
		accessControlService.assertManagerOwns(project);

		AppUser assignee = findUser(request.assignee());
		accessControlService.assertTeamMember(assignee);
		assertAssigneeBelongsToProject(project.getId(), assignee.getId());

		Task task = Task.builder()
			.project(project)
			.title(request.title())
			.description(request.description())
			.assignee(assignee)
			.priority(request.priority())
			.dueDate(request.dueDate())
			.status(TaskStatus.TODO)
			.build();

		Task savedTask = taskRepository.save(task);
		notificationService.taskAssigned(savedTask);
		projectService.refreshProjectProgress(project);
		return new MessageResponse("Task Created Successfully");
	}

	@Transactional
	public MessageResponse updateTask(Long taskId, UpdateTaskRequest request) {
		Task task = findTask(taskId);
		AppUser currentUser = accessControlService.currentUser();

		if (currentUser.getRole() == Role.PROJECT_MANAGER) {
			accessControlService.assertManagerOwns(task.getProject());
			applyManagerUpdate(task, request);
		} else if (currentUser.getRole() == Role.TEAM_MEMBER) {
			applyTeamMemberUpdate(task, request, currentUser);
		} else {
			throw new ForbiddenActionException("Customers cannot update tasks");
		}

		Task savedTask = taskRepository.save(task);
		notificationService.taskUpdated(savedTask);
		projectService.refreshProjectProgress(savedTask.getProject());
		return new MessageResponse("Task Updated Successfully");
	}

	@Transactional
	public MessageResponse deleteTask(Long taskId) {
		Task task = findTask(taskId);
		accessControlService.assertManagerOwns(task.getProject());
		Project project = task.getProject();
		notificationService.taskDeleted(task);
		taskRepository.delete(task);
		taskRepository.flush();
		projectService.refreshProjectProgress(project);
		return new MessageResponse("Task Deleted Successfully");
	}

	@Transactional(readOnly = true)
	public List<TaskResponse> getTasksByAssignee(Long userId) {
		AppUser currentUser = accessControlService.currentUser();
		if (!currentUser.getId().equals(userId)) {
			throw new ForbiddenActionException("Team members can only view their own tasks");
		}

		return taskRepository.findVisibleByAssigneeId(userId).stream()
			.map(this::toResponse)
			.toList();
	}

	@Transactional(readOnly = true)
	public List<TaskResponse> getTasksByProject(Long projectId) {
		Project project = projectService.findProject(projectId);
		accessControlService.assertCanViewProject(project);
		return taskRepository.findByProjectId(projectId).stream()
			.map(this::toResponse)
			.toList();
	}

	private void applyManagerUpdate(Task task, UpdateTaskRequest request) {
		if (request.title() != null) {
			task.setTitle(request.title());
		}
		if (request.description() != null) {
			task.setDescription(request.description());
		}
		if (request.assignee() != null) {
			AppUser assignee = findUser(request.assignee());
			accessControlService.assertTeamMember(assignee);
			assertAssigneeBelongsToProject(task.getProject().getId(), assignee.getId());
			task.setAssignee(assignee);
		}
		if (request.priority() != null) {
			task.setPriority(request.priority());
		}
		if (request.dueDate() != null) {
			task.setDueDate(request.dueDate());
		}
		if (request.status() != null) {
			task.setStatus(request.status());
		}
	}

	private void applyTeamMemberUpdate(Task task, UpdateTaskRequest request, AppUser currentUser) {
		if (task.getAssignee() == null || !task.getAssignee().getId().equals(currentUser.getId())) {
			throw new ForbiddenActionException("Team members can only update assigned tasks");
		}
		assertAssigneeBelongsToProject(task.getProject().getId(), currentUser.getId());
		if (request.title() != null || request.description() != null || request.assignee() != null
			|| request.priority() != null || request.dueDate() != null) {
			throw new ForbiddenActionException("Team members can only update task status");
		}
		if (request.status() == null) {
			throw new BadRequestException("Status is required");
		}
		task.setStatus(request.status());
	}

	private void assertAssigneeBelongsToProject(Long projectId, Long assigneeId) {
		if (!projectAssignmentRepository.existsByProjectIdAndTeamMemberId(projectId, assigneeId)) {
			throw new BadRequestException("Assignee must belong to the project assignment table");
		}
	}

	private Task findTask(Long taskId) {
		return taskRepository.findById(taskId)
			.orElseThrow(() -> new ResourceNotFoundException("Task not found"));
	}

	private AppUser findUser(Long userId) {
		return userRepository.findById(userId)
			.orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}

	private TaskResponse toResponse(Task task) {
		AppUser assignee = task.getAssignee();
		boolean assigneeIsActiveOnProject = assignee != null
			&& projectAssignmentRepository.existsByProjectIdAndTeamMemberId(task.getProject().getId(), assignee.getId());
		return new TaskResponse(
			task.getId(),
			task.getProject().getId(),
			task.getProject().getTitle(),
			task.getTitle(),
			task.getDescription(),
			assigneeIsActiveOnProject ? assignee.getId() : null,
			assigneeIsActiveOnProject ? assignee.getName() : null,
			task.getPriority(),
			task.getDueDate(),
			task.getStatus()
		);
	}
}
