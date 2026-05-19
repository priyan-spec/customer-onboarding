package com.onboarding.backend.service;

import java.time.LocalDateTime;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.onboarding.backend.dto.NotificationMessage;
import com.onboarding.backend.entity.AppUser;
import com.onboarding.backend.entity.NotificationType;
import com.onboarding.backend.entity.Project;
import com.onboarding.backend.entity.Task;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

	private final SimpMessagingTemplate messagingTemplate;

	public void projectCreated(Project project) {
		NotificationMessage message = message(
			NotificationType.PROJECT_CREATED,
			"Project Created",
			project.getId(),
			null,
			project.getManager().getId()
		);
		messagingTemplate.convertAndSend("/topic/projects", message);
		sendToUser(project.getCustomer(), message);
		sendToUser(project.getManager(), message);
	}

	public void taskAssigned(Task task) {
		AppUser assignee = task.getAssignee();
		NotificationMessage message = message(
			NotificationType.TASK_ASSIGNED,
			"Task Assigned",
			task.getProject().getId(),
			task.getId(),
			assignee == null ? null : assignee.getId()
		);
		messagingTemplate.convertAndSend("/topic/tasks", message);
		sendToUser(assignee, message);
	}

	public void taskUpdated(Task task) {
		AppUser assignee = task.getAssignee();
		NotificationMessage message = message(
			NotificationType.TASK_UPDATED,
			"Task Updated",
			task.getProject().getId(),
			task.getId(),
			assignee == null ? null : assignee.getId()
		);
		messagingTemplate.convertAndSend("/topic/tasks", message);
		sendToUser(task.getProject().getManager(), message);
		sendToUser(assignee, message);
	}

	public void projectProgressUpdated(Project project) {
		NotificationMessage message = message(
			NotificationType.PROJECT_PROGRESS_UPDATED,
			"Project Progress Updated",
			project.getId(),
			null,
			project.getCustomer().getId()
		);
		messagingTemplate.convertAndSend("/topic/projects", message);
		sendToUser(project.getCustomer(), message);
		sendToUser(project.getManager(), message);
	}

	public void projectCompleted(Project project) {
		NotificationMessage message = message(
			NotificationType.PROJECT_COMPLETED,
			"Project Completed",
			project.getId(),
			null,
			project.getCustomer().getId()
		);
		messagingTemplate.convertAndSend("/topic/projects", message);
		sendToUser(project.getCustomer(), message);
		sendToUser(project.getManager(), message);
	}

	private void sendToUser(AppUser user, NotificationMessage message) {
		if (user == null) {
			return;
		}
		messagingTemplate.convertAndSendToUser(user.getId().toString(), "/queue/notifications", message);
	}

	private NotificationMessage message(NotificationType type, String text, Long projectId, Long taskId, Long recipientId) {
		return new NotificationMessage(type, text, projectId, taskId, recipientId, LocalDateTime.now());
	}
}
