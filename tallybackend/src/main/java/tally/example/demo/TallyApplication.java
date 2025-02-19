package tally.example.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.event.EventListener;

import tally.example.demo.config.TesseractProperties;

@SpringBootApplication(
	scanBasePackages = {
		"tally.example.demo.controller",
		"tally.example.demo.service",
		"tally.example.demo.repository",
		"tally.example.demo.model",
		"tally.example.demo.config",
		"tally.example.demo.mapper"
	}
)
@EnableConfigurationProperties({TesseractProperties.class})
public class TallyApplication {
	private static final Logger logger = LoggerFactory.getLogger(TallyApplication.class);

	public static void main(String[] args) {
		logger.info("Starting Tally application...");
		SpringApplication.run(TallyApplication.class, args);
	}

	@EventListener(ApplicationStartedEvent.class)
	public void onApplicationStarted() {
		logger.info("Tally application started successfully!");
		logger.info("Server is running on port 8080");
		logger.info("Health endpoint available at: http://localhost:8080/api/health");
	}
}
