INSERT INTO department(name)
VALUES
    ('Engineering'),
    ('Quality Assurance'),
    ('Network Engineering'),
    ('Executive');
INSERT INTO role (title, salary, department_id)
VALUES
    ('Lead Engineer', 200000, 1),
    ('Engineer', 150000, 1),
    ('Quality Assurance Lead', 100000, 2),
    ('Quality Assurance', 70000, 2),
    ('Network Engineer Lead', 150000, 3),
    ('Network Engineer', 90000, 3),
    ('CISO', 250000, 4),
    ('Director of Information Security', 200000, 4);
INSERT INTO manager(full_name)
VALUES
  ('Henrietta Crabgrass'),
  ('Hendrick Crabgrass'),
  ('Hendersun Crabgrass'),
  ('Henderson Crabgrass');
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    (Henrietta, Crabgrass, 1, NULL)
    (Henry, Crabgrass, 2, 1)
    (Hendrick, Crabgrass, 3, NULL)
    (Henlea, Crabgrass, 4, 3)
    (Hendersun, Crabgrass, 5, NULL)
    (Hendrikje, Crabgrass, 6, 5)
    (Henderson, Crabgrass, 7, NULL)
    (Henka, Crabgrass, 8, 7);