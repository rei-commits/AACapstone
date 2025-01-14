-- Clean up existing data
DELETE FROM group_members;
DELETE FROM groups;
DELETE FROM users;

-- Insert test users
INSERT INTO users (id, full_name, email, password) VALUES 
(1, 'Member 1', 'member1@example.com', 'password'),
(2, 'Member 2', 'member2@example.com', 'password'),
(3, 'Member 3', 'member3@example.com', 'password');

-- Insert test groups
INSERT INTO groups (id, name, description) VALUES
(1, 'Test Group 1', 'Test Description 1'),
(2, 'Test Group 2', 'Test Description 2');

-- Insert group members
INSERT INTO group_members (group_id, user_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3); 