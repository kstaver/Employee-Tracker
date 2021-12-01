DROP DATABASE IF EXISTS techbusiness;
CREATE DATABASE techbusiness;
USE techbusiness;

CREATE TABLE department(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) UNIQUE NOT NULL
);
CREATE TABLE roles(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL UNSIGNED NOT NULL,
    department_id INTEGER,
    FOREIGN KEY (department_id) 
    REFERENCES department(id) 
    ON DELETE SET NULL
);
CREATE TABLE employee(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL UNIQUE,
    role_id INTEGER,
    CONSTRAINT fk_role
    FOREIGN KEY (role_id)
    REFERENCES roles(id) 
    ON DELETE SET NULL,
    FOREIGN KEY manager_id
    INTEGER REFERENCES employee(id)
    ON DELETE SET NULL
);
