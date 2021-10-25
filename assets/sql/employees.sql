DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;
CREATE TABLE department(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);
CREATE TABLE role(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL UNSIGNED NOT NULL,
    department_id INT UNSIGNED NOT NULL,
    INDEX dep_id (department_id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);
CREATE TABLE employee(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    INDEX role_ind(role_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT UNSIGNED,
    INDEX man_ind (manager_id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
USE employees;
INSERT INTO department
    (name)
    VALUES
        ('Engineering'),
        ('Quality Assurance'),
        ('Network Engineering'),
        ('Executive');
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Lead Engineer', 200000, 1),
    ('Engineer', 150000, 1),
    ('Quality Assurance Lead', 100000, 2),
    ('Quality Assurance', 70000, 2),
    ('Network Engineer Lead', 150000, 3),
    ('Network Engineer', 90000, 3),
    ('CISO', 250000, 4),
    ('Director of Information Security', 200000, 4);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    (Henrietta, Crabgrass, 1, NULL)
    (Henry, Crabgrass, 2, 1)
    (Hendrick, Crabgrass, 3, NULL)
    (Henlea, Crabgrass, 4, 3)
    (Hendersun, Crabgrass, 5, NULL)
    (Hendrikje, Crabgrass, 6, 5)
    (Henderson, Crabgrass, 7, NULL)
    (Henka, Crabgrass, 8, 7);