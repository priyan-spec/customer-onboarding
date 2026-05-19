package com.onboarding.backend.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.onboarding.backend.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
		return build(HttpStatus.NOT_FOUND, ex.getMessage(), request, null);
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex, WebRequest request) {
		return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request, null);
	}

	@ExceptionHandler({ForbiddenActionException.class, AuthorizationDeniedException.class})
	public ResponseEntity<ErrorResponse> handleForbidden(Exception ex, WebRequest request) {
		return build(HttpStatus.FORBIDDEN, ex.getMessage(), request, null);
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, WebRequest request) {
		return build(HttpStatus.UNAUTHORIZED, "Invalid email or password", request, null);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
		Map<String, String> errors = new LinkedHashMap<>();
		ex.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
		return build(HttpStatus.BAD_REQUEST, "Validation failed", request, errors);
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<ErrorResponse> handleUploadSize(MaxUploadSizeExceededException ex, WebRequest request) {
		return build(HttpStatus.PAYLOAD_TOO_LARGE, "Uploaded files exceed configured size limits", request, null);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleUnhandled(Exception ex, WebRequest request) {
		return build(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error", request, null);
	}

	private ResponseEntity<ErrorResponse> build(
		HttpStatus status,
		String message,
		WebRequest request,
		Map<String, String> validationErrors
	) {
		ErrorResponse response = new ErrorResponse(
			LocalDateTime.now(),
			status.value(),
			status.getReasonPhrase(),
			message,
			request.getDescription(false).replace("uri=", ""),
			validationErrors
		);
		return ResponseEntity.status(status).body(response);
	}
}
