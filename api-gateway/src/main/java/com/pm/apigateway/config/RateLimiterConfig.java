package com.pm.apigateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver userKeyResolver() {
        // Resolve rate limit key based on authenticated user (Principal) or IP address
        return exchange -> exchange.getPrincipal()
                .map(java.security.Principal::getName)
                .defaultIfEmpty(exchange.getRequest().getRemoteAddress().getAddress().getHostAddress());
    }
}
