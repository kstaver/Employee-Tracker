USE techbusiness;

INSERT INTO department(name)
VALUES
    ('Engineering'),
    ('Quality Assurance'),
    ('Network Engineering'),
    ('Executive');
INSERT INTO roles (title, salary, department_id)
VALUES
    ('Chief Engineer', 200000, 1),
    ('Engineer', 150000, 1),
    ('Quality Assurance Lead', 100000, 2),
    ('Quality Assurance', 70000, 2),
    ('Lead Network Engineer', 125000, 3),
    ('Network Engineer', 90000, 3),
    ('CISO', 300000, 4),
    ('Director of Information Security', 250000, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    (Henrietta, Crabgrass, 1, NULL),
    (Henry, Crabgrass, 2, 1),
    (Hendrick, Crabgrass, 3, NULL),
    (Henlea, Crabgrass, 4, 3),
    (Hendersun, Crabgrass, 5, NULL),
    (Hendrikje, Crabgrass, 6, 5),
    (Henderson, Crabgrass, 7, NULL),
    (Henka, Crabgrass, 8, 7);