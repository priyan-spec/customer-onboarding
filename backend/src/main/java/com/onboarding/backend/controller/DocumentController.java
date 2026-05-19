package com.onboarding.backend.controller;

import java.util.List;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.onboarding.backend.dto.DocumentResponse;
import com.onboarding.backend.entity.Document;
import com.onboarding.backend.service.DocumentService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

	private final DocumentService documentService;

	@GetMapping("/project/{projectId}")
	@PreAuthorize("hasAnyRole('CUSTOMER', 'PROJECT_MANAGER')")
	@Operation(summary = "Get project documents", description = "Returns uploaded document metadata for a project.")
	public List<DocumentResponse> getProjectDocuments(@PathVariable Long projectId) {
		return documentService.getProjectDocuments(projectId);
	}

	@GetMapping("/{documentId}")
	@PreAuthorize("hasAnyRole('CUSTOMER', 'PROJECT_MANAGER')")
	@Operation(summary = "Download document", description = "Downloads a document blob.")
	public ResponseEntity<byte[]> downloadDocument(@PathVariable Long documentId) {
		Document document = documentService.getDocument(documentId);
		MediaType mediaType = document.getContentType() == null
			? MediaType.APPLICATION_OCTET_STREAM
			: MediaType.parseMediaType(document.getContentType());

		return ResponseEntity.ok()
			.contentType(mediaType)
			.header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
				.filename(document.getFileName())
				.build()
				.toString())
			.body(document.getData());
	}
}
