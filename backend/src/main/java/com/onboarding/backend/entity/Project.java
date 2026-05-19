package com.onboarding.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "projects")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private AppUser customer;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "manager_id", nullable = false)
	private AppUser manager;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ProjectStatus status;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Priority priority;

	@Column(nullable = false)
	private LocalDate deadline;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false, length = 1000)
	private String description;

	@Column(nullable = false, columnDefinition = "text")
	private String requirements;

	@Column(nullable = false)
	private Integer progress;

	@PrePersist
	void onCreate() {
		createdAt = LocalDateTime.now();
		if (status == null) {
			status = ProjectStatus.ACTIVE;
		}
		if (progress == null) {
			progress = 0;
		}
	}
}
