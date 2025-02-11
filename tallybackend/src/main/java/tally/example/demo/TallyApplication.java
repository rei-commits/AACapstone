package tally.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(
	scanBasePackages = {
		"tally.example.demo.controller",
		"tally.example.demo.service",
		"tally.example.demo.repository",
		"tally.example.demo.model",
		"tally.example.demo.config",
		"tally.example.demo.mapper"
	},
	exclude = {SecurityAutoConfiguration.class}
)
public class TallyApplication {

	public static void main(String[] args) {
		SpringApplication.run(TallyApplication.class, args);
	}

}
