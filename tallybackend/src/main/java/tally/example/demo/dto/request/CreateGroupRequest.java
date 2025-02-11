package tally.example.demo.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class CreateGroupRequest {
    private String name;
    private List<String> memberIds;
} 