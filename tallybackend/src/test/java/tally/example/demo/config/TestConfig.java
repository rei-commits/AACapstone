package tally.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("test")
public class TestConfig {
    
    @Bean
    @Primary
    public FirebaseConfig mockFirebaseConfig() {
        return new FirebaseConfig() {
            @Override
            public void initialize() {
                // Do nothing - mock implementation for tests
            }
        };
    }
} 