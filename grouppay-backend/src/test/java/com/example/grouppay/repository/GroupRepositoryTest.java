package com.example.grouppay.repository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;
import com.example.grouppay.model.Group;

@DataJpaTest
class GroupRepositoryTest {

    @Autowired
    private GroupRepository groupRepository;

    @Test
    void findByNameContaining_ShouldReturnMatchingGroups() {
        // Arrange
        Group group1 = new Group();
        group1.setName("Family Group");
        group1.setDescription("Family expenses");

        Group group2 = new Group();
        group2.setName("Friends Group");
        group2.setDescription("Friend expenses");

        groupRepository.save(group1);
        groupRepository.save(group2);

        // Act
        List<Group> found = groupRepository.findByNameContaining("Family");

        // Assert
        assertThat(found).hasSize(1);
        assertThat(found.get(0).getName()).isEqualTo("Family Group");
    }

    @Test
    @Sql("/test-data.sql")
    void findGroupsByUserId_ShouldReturnUserGroups() {
        // Act
        List<Group> userGroups = groupRepository.findGroupsByUserId(1L);

        // Assert
        assertThat(userGroups).isNotEmpty();
        assertThat(userGroups).extracting(Group::getName)
                             .containsExactlyInAnyOrder("Test Group 1", "Test Group 2");
    }
} 