package com.onboarding.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.onboarding.backend.dto.NotificationMessage;
import com.onboarding.backend.entity.AppUser;
import com.onboarding.backend.entity.NotificationType;
import com.onboarding.backend.entity.Project;
import com.onboarding.backend.entity.Task;
import com.onboarding.backend.entity.UserNotification;
import com.onboarding.backend.repository.ProjectAssignmentRepository;
import com.onboarding.backend.repository.UserNotificationRepository;
import com.onboarding.backend.util.CurrentUserUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

	private final SimpMessagingTemplate messagingTemplate;
	private final ProjectAssignmentRepository projectAssignmentRepository;
	private final UserNotificationRepository userNotificationRepository;
	private final CurrentUserUtil currentUserUtil;

	public void projectCreated(Project project) {
		NotificationMessage message = message(
			NotificationType.PROJECT_CREATED,
			"Project Created",
			project.getId(),
			null,
			project.getManager().getId()
		);
		sendToProjectAudience(project, message);
	}

	public void taskAssigned(Task task) {
		AppUser assignee = activeAssignee(task);
		NotificationMessage message = message(
			NotificationType.TASK_ASSIGNED,
			"Task Assigned",
			task.getProject().getId(),
			task.getId(),
			assignee == null ? null : assignee.getId()
		);
		sendToProjectAudience(task.getProject(), message, assignee);
	}

	public void taskUpdated(Task task) {
		AppUser assignee = activeAssignee(task);
		NotificationMessage message = message(
			NotificationType.TASK_UPDATED,
			"Task Updated",
			task.getProject().getId(),
			task.getId(),
			assignee == null ? null : assignee.getId()
		);
		sendToProjectAudience(task.getProject(), message, assignee);
	}

	public void taskDeleted(Task task) {
		AppUser assignee = activeAssignee(task);
		NotificationMessage message = message(
			NotificationType.TASK_DELETED,
			"Task Deleted",
			task.getProject().getId(),
			task.getId(),
			assignee == null ? null : assignee.getId()
		);
		sendToProjectAudience(task.getProject(), message, assignee);
	}

	public void projectAssignmentUpdated(Project project, AppUser changedMember, String text) {
		NotificationMessage message = message(
			NotificationType.PROJECT_ASSIGNMENT_UPDATED,
			text,
			project.getId(),
			null,
			changedMember == null ? null : changedMember.getId()
		);
		sendToProjectAudience(project, message, changedMember);
	}

	public void projectProgressUpdated(Project project) {
		NotificationMessage message = message(
			NotificationType.PROJECT_PROGRESS_UPDATED,
			"Project Progress Updated",
			project.getId(),
			null,
			project.getCustomer().getId()
		);
		sendToProjectAudience(project, message);
	}

	public void projectCompleted(Project project) {
		NotificationMessage message = message(
			NotificationType.PROJECT_COMPLETED,
			"Project Completed",
			project.getId(),
			null,
			project.getCustomer().getId()
		);
		sendToProjectAudience(project, message);
	}

	private void sendToProjectAudience(Project project, NotificationMessage message, AppUser... extraUsers) {
		List<AppUser> recipients = projectAudience(project, extraUsers);
		List<NotificationMessage> persistedMessages = recipients.stream()
			.map(user -> saveNotification(user, message))
			.toList();
		publishAfterCommit(() -> persistedMessages.forEach(this::sendToUser));
	}

	private List<AppUser> projectAudience(Project project, AppUser... extraUsers) {
		Map<Long, AppUser> recipients = new LinkedHashMap<>();
		addRecipient(recipients, project.getCustomer());
		addRecipient(recipients, project.getManager());
		projectAssignmentRepository.findByProjectId(project.getId())
			.forEach(assignment -> addRecipient(recipients, assignment.getTeamMember()));
		Arrays.stream(extraUsers).forEach(user -> addRecipient(recipients, user));
		return new ArrayList<>(recipients.values());
	}

	private void addRecipient(Map<Long, AppUser> recipients, AppUser user) {
		if (user != null && user.getId() != null) {
			recipients.putIfAbsent(user.getId(), user);
		}
	}

	private AppUser activeAssignee(Task task) {
		AppUser assignee = task.getAssignee();
		if (assignee == null) {
			return null;
		}
		return projectAssignmentRepository.existsByProjectIdAndTeamMemberId(task.getProject().getId(), assignee.getId())
			? assignee
			: null;
	}

	private void sendToUser(NotificationMessage message) {
		if (message.recipientId() == null) {
			return;
		}
		messagingTemplate.convertAndSend("/queue/notifications/" + message.recipientId(), message);
	}

	private void publishAfterCommit(Runnable publishAction) {
		if (!TransactionSynchronizationManager.isSynchronizationActive()) {
			publishAction.run();
			return;
		}

		TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
			@Override
			public void afterCommit() {
				publishAction.run();
			}
		});
	}

	@Transactional(readOnly = true)
	public List<NotificationMessage> getCurrentUserNotifications(int limit) {
		int pageSize = Math.max(1, Math.min(limit, 3));
		Long userId = currentUserUtil.getCurrentUserId();
		return userNotificationRepository.findByRecipient_IdOrderByCreatedAtDescIdDesc(userId, PageRequest.of(0, pageSize))
			.stream()
			.map(this::toMessage)
			.toList();
	}

	private NotificationMessage message(NotificationType type, String text, Long projectId, Long taskId, Long recipientId) {
		return new NotificationMessage(null, type, text, projectId, taskId, recipientId, LocalDateTime.now(), List.of());
	}

	private NotificationMessage saveNotification(AppUser recipient, NotificationMessage message) {
		UserNotification notification = UserNotification.builder()
			.recipient(recipient)
			.type(message.type())
			.message(message.message())
			.projectId(message.projectId())
			.taskId(message.taskId())
			.createdAt(message.createdAt())
			.build();
		return toMessage(userNotificationRepository.save(notification));
	}

	private NotificationMessage toMessage(UserNotification notification) {
		return new NotificationMessage(
			notification.getId(),
			notification.getType(),
			notification.getMessage(),
			notification.getProjectId(),
			notification.getTaskId(),
			notification.getRecipient().getId(),
			notification.getCreatedAt(),
			List.of(notification.getRecipient().getId())
		);
	}
}
