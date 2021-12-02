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
        const sql = `SELECT * FROM employee WHERE manager_id is NULL`;
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
                f_name: "first_name",
                message: "What is the employee's first namer",
                validate: (f_name){
                    if(f_name){
                        return true;
                    }else{
                        console.log("Please enter the new employee's first name.");
                        return false;
                    }
                },
            },
        ])
     } catch (err){
        console.error(err);
    }
}

// Add a department
async function addDepartment(table){
    try{ } catch (err){
        console.error(err);
    }
}

// Add a role
async function addRole(table){
    try{ } catch (err){
        console.error(err);
    }
}

// Update an employee
async function updateEmployee(updateValue){
    try{ } catch (err){
        console.error(err);
    }
}

module.exports = { viewEmployees, viewDepartments, viewRoles, getAllManagers, addEmployee, addDepartment, addRole, updateEmployee };