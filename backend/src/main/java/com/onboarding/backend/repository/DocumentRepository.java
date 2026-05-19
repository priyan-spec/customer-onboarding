package com.onboarding.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.onboarding.backend.entity.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {

	List<Document> findByProjectId(Long projectId);
}
