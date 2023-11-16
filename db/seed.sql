INSERT INTO department (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Finance'),
    ('Legal');


INSERT INTO role (title, salary, department_id)
VALUES  
    ('Software Enineer', 85000, 1),
    ('Salesperson', 75000, 2),
    ('Accountant', 125000, 3),
    ('Lawyer', 200000, 4);


INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES
    ('Juan', 'Smith',1, 4),
    ('Jose', 'Hernandez', 2, 2),
    ('Kevin', 'Lopez', 3, 3),
    ('Stephen', 'Salvador', 4, 5);