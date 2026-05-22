package com.onboarding.backend.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.onboarding.backend.dto.CreateProjectResponse;
import com.onboarding.backend.dto.DocumentResponse;
import com.onboarding.backend.dto.ProjectDetailResponse;
import com.onboarding.backend.dto.ProjectSummaryResponse;
import com.onboarding.backend.entity.AppUser;
import com.onboarding.backend.entity.Document;
import com.onboarding.backend.entity.Priority;
import com.onboarding.backend.entity.Project;
import com.onboarding.backend.entity.ProjectStatus;
import com.onboarding.backend.entity.Role;
import com.onboarding.backend.entity.TaskStatus;
import com.onboarding.backend.exception.BadRequestException;
import com.onboarding.backend.exception.ForbiddenActionException;
import com.onboarding.backend.exception.ResourceNotFoundException;
import com.onboarding.backend.repository.DocumentRepository;
import com.onboarding.backend.repository.ProjectRepository;
import com.onboarding.backend.repository.TaskRepository;
import com.onboarding.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {

	private static final String AUTHENTICATED_CUSTOMER_PROJECTS_KEY =
		"#userId + ':' + T(org.springframework.security.core.context.SecurityContextHolder).getContext().getAuthentication().getName()";
	private static final String AUTHENTICATED_MANAGER_PROJECTS_KEY =
		"#managerId + ':' + T(org.springframework.security.core.context.SecurityContextHolder).getContext().getAuthentication().getName()";

	private final ProjectRepository projectRepository;
	private final UserRepository userRepository;
	private final DocumentRepository documentRepository;
	private final TaskRepository taskRepository;
	private final AccessControlService accessControlService;
	private final NotificationService notificationService;

	@Transactional
	@CacheEvict(cacheNames = { "customerProjects", "managerProjects" }, allEntries = true)
	public CreateProjectResponse createProject(
		String title,
		String description,
		String requirements,
		Priority priority,
		LocalDate deadline,
		List<MultipartFile> documents
	) {
		AppUser customer = accessControlService.currentUser();
		AppUser manager = leastLoadedManager();

		Project project = Project.builder()
			.customer(customer)
			.manager(manager)
			.status(ProjectStatus.ACTIVE)
			.priority(priority)
			.deadline(deadline)
			.title(title)
			.description(description)
			.requirements(requirements)
			.progress(0)
			.build();

		Project savedProject = projectRepository.save(project);
		saveDocuments(savedProject, documents);
		notificationService.projectCreated(savedProject);

		return new CreateProjectResponse(
			savedProject.getId(),
			manager.getId(),
			savedProject.getStatus(),
			"Project Created Successfully"
		);
	}

	@Transactional(readOnly = true)
	@Cacheable(cacheNames = "customerProjects", key = AUTHENTICATED_CUSTOMER_PROJECTS_KEY)
	public List<ProjectSummaryResponse> getCustomerProjects(Long userId) {
		AppUser currentUser = accessControlService.currentUser();
		if (!currentUser.getId().equals(userId)) {
			throw new ForbiddenActionException("Customers can only view their own projects");
		}
		return projectRepository.findByCustomerId(userId).stream()
			.map(this::toSummary)
			.collect(Collectors.toCollection(ArrayList::new));
	}

	@Transactional(readOnly = true)
	@Cacheable(cacheNames = "managerProjects", key = AUTHENTICATED_MANAGER_PROJECTS_KEY)
	public List<ProjectSummaryResponse> getManagerProjects(Long managerId) {
		AppUser currentUser = accessControlService.currentUser();
		if (!currentUser.getId().equals(managerId)) {
			throw new ForbiddenActionException("Managers can only view their assigned projects");
		}
		return projectRepository.findByManagerId(managerId).stream()
			.map(this::toSummary)
			.collect(Collectors.toCollection(ArrayList::new));
	}

	@Transactional(readOnly = true)
	public ProjectDetailResponse getProject(Long projectId) {
		Project project = findProject(projectId);
		accessControlService.assertCanViewProject(project);
		return toDetail(project);
	}

	@Transactional
	@CacheEvict(cacheNames = { "customerProjects", "managerProjects" }, allEntries = true)
	public void refreshProjectProgress(Project project) {
		long totalTasks = taskRepository.countByProjectId(project.getId());
		int progress = totalTasks == 0
			? project.getProgress()
			: (int) Math.round((taskRepository.countByProjectIdAndStatus(project.getId(), TaskStatus.DONE) * 100.0) / totalTasks);

		boolean progressChanged = !Integer.valueOf(progress).equals(project.getProgress());
		project.setProgress(progress);
		if (progressChanged) {
			notificationService.projectProgressUpdated(project);
		}

		if (progress == 100 && project.getStatus() != ProjectStatus.COMPLETED) {
			project.setStatus(ProjectStatus.COMPLETED);
			notificationService.projectCompleted(project);
		}
		projectRepository.save(project);
	}

	public Project findProject(Long projectId) {
		return projectRepository.findById(projectId)
			.orElseThrow(() -> new ResourceNotFoundException("Project not found"));
	}

	public ProjectSummaryResponse toSummary(Project project) {
		return new ProjectSummaryResponse(
			project.getId(),
			project.getTitle(),
			project.getCustomer().getName(),
			project.getStatus(),
			project.getPriority(),
			project.getDeadline(),
			project.getProgress(),
			project.getRequirements(),
			documentResponses(project.getId())
		);
	}

	private ProjectDetailResponse toDetail(Project project) {
		return new ProjectDetailResponse(
			project.getId(),
			project.getTitle(),
			project.getDescription(),
			project.getRequirements(),
			project.getPriority(),
			project.getStatus(),
			project.getDeadline(),
			project.getProgress(),
			project.getCustomer().getId(),
			project.getCustomer().getName(),
			project.getManager().getId(),
			project.getManager().getName(),
			documentResponses(project.getId())
		);
	}

	private AppUser leastLoadedManager() {
		return userRepository.findLeastLoadedManagers(Role.PROJECT_MANAGER, ProjectStatus.ACTIVE, PageRequest.of(0, 1))
			.stream()
			.findFirst()
			.orElseThrow(() -> new BadRequestException("No project manager is available"));
	}

	private void saveDocuments(Project project, List<MultipartFile> files) {
		if (files == null || files.isEmpty()) {
			return;
		}

		files.stream()
			.filter(file -> file != null && !file.isEmpty())
			.map(file -> toDocument(project, file))
			.forEach(documentRepository::save);
	}

	private Document toDocument(Project project, MultipartFile file) {
		try {
			return Document.builder()
				.project(project)
				.fileName(file.getOriginalFilename() == null ? "document" : file.getOriginalFilename())
				.contentType(file.getContentType())
				.data(file.getBytes())
				.build();
		} catch (IOException ex) {
			throw new BadRequestException("Unable to read uploaded file: " + file.getOriginalFilename());
		}
	}

	private DocumentResponse toDocumentResponse(Document document) {
		return new DocumentResponse(document.getId(), document.getFileName());
	}

	private List<DocumentResponse> documentResponses(Long projectId) {
		return documentRepository.findByProjectId(projectId).stream()
			.map(this::toDocumentResponse)
			.collect(Collectors.toCollection(ArrayList::new));
	}
}
