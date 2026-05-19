package com.onboarding.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onboarding.backend.dto.DocumentResponse;
import com.onboarding.backend.entity.Document;
import com.onboarding.backend.exception.ResourceNotFoundException;
import com.onboarding.backend.repository.DocumentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentService {

	private final DocumentRepository documentRepository;
	private final ProjectService projectService;
	private final AccessControlService accessControlService;

	@Transactional(readOnly = true)
	public List<DocumentResponse> getProjectDocuments(Long projectId) {
		accessControlService.assertCanViewProject(projectService.findProject(projectId));
		return documentRepository.findByProjectId(projectId).stream()
			.map(document -> new DocumentResponse(document.getId(), document.getFileName()))
			.toList();
	}

	@Transactional(readOnly = true)
	public Document getDocument(Long documentId) {
		Document document = documentRepository.findById(documentId)
			.orElseThrow(() -> new ResourceNotFoundException("Document not found"));
		accessControlService.assertCanViewProject(document.getProject());
		return document;
	}
}
