package com.onboarding.backend.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private final String jwtSecret;
	private final long expirationMs;

	public JwtService(
		@Value("${app.jwt.secret}") String jwtSecret,
		@Value("${app.jwt.expiration-ms}") long expirationMs
	) {
		this.jwtSecret = jwtSecret;
		this.expirationMs = expirationMs;
	}

	public String generateToken(AppUserDetails userDetails) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + expirationMs);

		return Jwts.builder()
			.subject(userDetails.getUsername())
			.claim("userId", userDetails.getId())
			.claim("role", userDetails.getRole().name())
			.issuedAt(now)
			.expiration(expiry)
			.signWith(signingKey())
			.compact();
	}

	public String extractUsername(String token) {
		return claims(token).getSubject();
	}

	public boolean isTokenValid(String token, UserDetails userDetails) {
		String username = extractUsername(token);
		return username.equals(userDetails.getUsername()) && !isExpired(token);
	}

	private boolean isExpired(String token) {
		return claims(token).getExpiration().before(new Date());
	}

	private Claims claims(String token) {
		return Jwts.parser()
			.verifyWith(signingKey())
			.build()
			.parseSignedClaims(token)
			.getPayload();
	}

	private SecretKey signingKey() {
		return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
	}
}
