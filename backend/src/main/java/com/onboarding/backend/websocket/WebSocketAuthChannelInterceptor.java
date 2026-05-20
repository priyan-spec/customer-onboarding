package com.onboarding.backend.websocket;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import com.onboarding.backend.security.AppUserDetails;
import com.onboarding.backend.security.CustomUserDetailsService;
import com.onboarding.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

	private final JwtService jwtService;
	private final CustomUserDetailsService userDetailsService;

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
		if (accessor == null) {
			return message;
		}
		if (accessor.getCommand() == StompCommand.SUBSCRIBE) {
			return canSubscribe(accessor) ? message : null;
		}
		if (accessor.getCommand() != StompCommand.CONNECT) {
			return message;
		}

		String authorization = accessor.getFirstNativeHeader("Authorization");
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			return message;
		}

		try {
			String token = authorization.substring(7);
			String username = jwtService.extractUsername(token);
			AppUserDetails userDetails = (AppUserDetails) userDetailsService.loadUserByUsername(username);
			if (jwtService.isTokenValid(token, userDetails)) {
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
					userDetails.getId().toString(),
					null,
					userDetails.getAuthorities()
				);
				accessor.setUser(authentication);
				if (accessor.getSessionAttributes() != null) {
					accessor.getSessionAttributes().put("userId", userDetails.getId().toString());
				}
			}
		} catch (RuntimeException ignored) {
			return message;
		}

		return message;
	}

	private boolean canSubscribe(StompHeaderAccessor accessor) {
		String destination = accessor.getDestination();
		if (destination == null || !destination.startsWith("/queue/notifications/")) {
			return true;
		}
		String userId = destination.substring("/queue/notifications/".length());
		return userId.equals(authenticatedUserId(accessor));
	}

	private String authenticatedUserId(StompHeaderAccessor accessor) {
		if (accessor.getUser() != null) {
			return accessor.getUser().getName();
		}

		Object sessionUserId = accessor.getSessionAttributes() == null
			? null
			: accessor.getSessionAttributes().get("userId");
		if (sessionUserId instanceof String userId) {
			return userId;
		}

		String authorization = accessor.getFirstNativeHeader("Authorization");
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			return null;
		}

		try {
			String token = authorization.substring(7);
			String username = jwtService.extractUsername(token);
			AppUserDetails userDetails = (AppUserDetails) userDetailsService.loadUserByUsername(username);
			return jwtService.isTokenValid(token, userDetails) ? userDetails.getId().toString() : null;
		} catch (RuntimeException ignored) {
			return null;
		}
	}
}
