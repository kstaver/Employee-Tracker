// For async functions
const db = require('../../db');
const cTable = require('console.table');
const inquirer = require('inquirer');

// View all employees
async function viewEmployees(table){
    let sql = `SELECT SELECT e.id, e.first_name, e.last_name, role_name, department_name, 
    salary, manager.first_name manager FROM ${table} e 
    LEFT JOIN roles r ON e.role_id = r.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON e.manager_id = manager.id`;
    try{
        const results = await db.promise().execute(sql);
        return results[0];
    }catch (err){
        console.error(err);
    }
}

// View all departments
async function viewDepartments(table){
    let sql = `SELECT * FROM ${table}`;
    try{
        const results = await db.promise().execute(sql);
        return results[0];
    }catch (err){
        console.error(err);

    }
}

// View all roles
async function viewRoles(table){
    let sql = `SELECT role_name, role.id, department_name, salary 
    FROM ${table} INNER JOIN department ON ${table}.department_id = department.id`;
    try{
        const results = await db.promise().execute(sql);
        return results[0];
    }catch (err){
        console.error(err);
    }
}

// View all managers
async function getAllManagers(){
    try{
        const sql = `SELECT * FROM employee WHERE manager_id IS NULL`;
        const results = await db.promise().execte(sql);
        return results[0];
    }catch (err){
        console.error(err);
    }
}

// Add an employee
async function addEmployee(table){
    try{
        const data = await inquirer.prompt([
            {
                type: "input",
                name: f_name,
                message: "What is the employee's first name?",
                validate: (f_name) =>{
                    if(f_name){
                        return true;
                    }else{
                        console.log("Please enter the employee's first name.");
                        return false;
                    }
                }
            },
            {
                type: "input",
                name: "l_name",
                message: "What is the employee's last name?",
                validate: (l_name) =>{
                    if(l_name){
                        return true;
                    }else{
                        console.log("Please enter the employee's last name.");
                        return false;
                    }
                }
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: async function(){
                    const results = await viewQuery("role");
                    return results.map(({role_name, id}) => ({
                        name: role_name,
                        value: id,
                    }));
                },
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: async function(){
                    const results = await getAllManagers();
                    return results.map(({f_name, l_name, id}) => ({
                        name: `${f_name} ${l_name}`,
                        value: id,
                    }));
                },
            },
        ]);
        try {
            const sql = `INSERT INTO ${table} (f_name, l_name, role_id, manager_id) 
            VALUES ("${data.f_name}", "${data.l_name}", "${data.role}", ${data.manager})`;
            const results = await db.promise().execute(sql);
            console.log("Employee added successfully!");
            return true;
        }catch(err){
            console.error(err);
        }
    } catch (err){
        console.error(err);
    }
}

// Add a department
async function addDepartment(table){
    try{
        const newDept = await inquirer.prompt(
            {
                type: "input",
                name: "new_dept",
                message: "What is the new department's name?",
                validate: (new_dept) =>{
                    if(new_dept){
                        return true;
                    }else{m
                        console.log("Please enter the new department's name.");
                        return false;
                    }
                }
            });
        const sql = `INSERT INTO ${table} (department_name) VALUES ("${newDept.new_dept}")`;
        const results = await db.promise().execute(sql);
        console.log("Department added successfully!");
        return true;
    } catch (err){
        console.log(err);
    }
}

// Add a role
async function addRole(table){
    try{
        const data = await inquirer.prompt([
            {
                type: "input",
                name: "new_role",
                message: "What is the new role's name?",
                validate: (new_role) =>{
                    if(new_role){
                        return true;
                    }else{
                        console.log("Please enter the new role's name.");
                        return false;
                    }
                },
            },
            {
                type: "input",
                name: "salary",
                message: "What is the new role's salary?",
                validate: (salary) =>{
                    if(!isNaN(salary)){
                        return true;
                    }else {
                        console.log("Please enter the new role's salary.");
                        return false;
                    }
                }
            },
            {
                type: "list",
                name: "department",
                message: "What is the department of this role?",
                choices: async function (){
                    const results = await viewQuery("department");
                    return results.map(({department_name, id}) => ({
                        name: department_name,
                        value: id,
                    }));
                },
            },
        ]);
        const sql = `INSERT INTO ${table} (role_name, salray, department_id) 
        VALUES ('${data.new_role}', ${data.salaray}, ${data.department})`;
        try {
            const results = await db.promise().execute(sql);
            console.log("New role has been added to Role's table");
            return true;
        } catch (err) {
            console.error(err);
        }
    }catch (err){
        console.error(err);
    }
}

// Update an employee
async function updateEmployee(updateValue){
    try {
        const data = await inquirer.prompt([
          {
            type: "list",
            name: "employee_selection",
            message: "What employee do you want to update?",
            choices: async function () {
              const results = await viewEmployees("employee");
              return results.map(({ f_name, l_name, id }) => ({
                name: `${f_name} ${l_name}`,
                value: id,
              }));
            },
          },
          {
            type: "list",
            name: "new_role",
            message: "What is the new role of this employee?",
            choices: async function () {
              const results = await viewRoles("role");
              return results.map(({ role_name, id }) => ({
                name: role_name,
                value: id,
              }));
            },
          },
        ]);
        try {
          const sql = `UPDATE employee SET role_id = ${data.new_role} WHERE id = ${data.employee_selection}`;
          const results = await db.promise().execute(sql);
          console.log("Employee information has been updated");
          return true;
        } catch (err) {
          console.error(err);
        }
    } catch (err) {
    console.error(err);
    }
}

module.exports = { viewEmployees, viewDepartments, viewRoles, getAllManagers, addEmployee, addDepartment, addRole, updateEmployee };