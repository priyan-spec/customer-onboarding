package com.onboarding.backend.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.onboarding.backend.dto.NotificationMessage;
import com.onboarding.backend.service.NotificationService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

	private final NotificationService notificationService;

	@GetMapping
	@PreAuthorize("isAuthenticated()")
	@Operation(summary = "Get current user notifications", description = "Returns the latest notifications for the logged-in user.")
	public List<NotificationMessage> getCurrentUserNotifications(
		@RequestParam(defaultValue = "3") int limit
	) {
		return notificationService.getCurrentUserNotifications(limit);
	}
}
