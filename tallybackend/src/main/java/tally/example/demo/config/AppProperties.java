package tally.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "app")
@Data
public class AppProperties {
    private Firebase firebase = new Firebase();

    @Data
    public static class Firebase {
        private String configFile;
    }
} 