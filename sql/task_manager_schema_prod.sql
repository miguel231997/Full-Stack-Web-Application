drop database if exists task_manager_schema_prod;
create database task_manager_schema_prod;
use task_manager_schema_prod;

CREATE TABLE users (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE tasks (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    user_id BIGINT, -- foreign key to the users table
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE roles (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
	user_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);

INSERT INTO users (username, password, email) VALUES
('john_doe', 'password123!', 'john@example.com'),
('jane_smith', 'password456!', 'jane@example.com'),
('admin_user', 'adminpassword!', 'admin@example.com');

INSERT INTO roles(role_name) VALUES
('ADMIN'),
('USER');


INSERT INTO tasks (title, description, status, user_id) VALUES 
('Finish report', 'Complete the annual report for Q4', 'Pending', 1),  -- john_doe
('Fix bugs', 'Fix all bugs in the system before release', 'In Progress', 1),  -- john_doe
('Prepare presentation', 'Prepare slides for the next team meeting', 'Pending', 2),  -- jane_smith
('Database migration', 'Migrate the database to the cloud', 'Completed', 3);  -- admin_user


-- Assign 'USER' role to john_doe
INSERT INTO user_roles (user_id, role_id) VALUES (1, 2);  -- john_doe is a USER

-- Assign 'USER' role to jane_smith
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2);  -- jane_smith is a USER

-- Assign 'ADMIN' role to admin_user
INSERT INTO user_roles (user_id, role_id) VALUES (3, 1);  -- admin_user is an ADMIN

-- Assign 'USER' role to admin_user (admin has multiple roles)
INSERT INTO user_roles (user_id, role_id) VALUES (3, 2);  -- admin_user is also a USER