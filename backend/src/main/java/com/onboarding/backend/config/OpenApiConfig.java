package com.onboarding.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI onboardingOpenApi() {
		SecurityScheme bearerScheme = new SecurityScheme()
			.name("Authorization")
			.type(SecurityScheme.Type.HTTP)
			.scheme("bearer")
			.bearerFormat("JWT");

		return new OpenAPI()
			.info(new Info()
				.title("Customer Onboarding Tracker API")
				.description("REST APIs for customer onboarding, tasks, project assignments, documents, and notifications.")
				.version("1.0.0"))
			.components(new Components().addSecuritySchemes("bearerAuth", bearerScheme))
			.addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
	}
}
