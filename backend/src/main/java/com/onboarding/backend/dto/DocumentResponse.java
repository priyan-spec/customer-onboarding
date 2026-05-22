package com.onboarding.backend.dto;

import java.io.Serializable;

public record DocumentResponse(
	Long id,
	String fileName
) implements Serializable {
}
