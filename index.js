'use strict';

const inquirer = require('inquirer');
const mysql = require('mysql');
const { async } = require('rxjs');
require('console.table');

// View all employees option
function viewAllEmployees(){
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name
    AS department, role.salary, CONCAT(manager.first_name,'',manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
    connection.query(query, (err, res) => {
        if(err) throw err;
        console.log('\n');
        console.log('VIEW ALL EMPLOYEES');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

// View employees by department
function viewByDepartment(){
    const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role.id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;
    connection.query(query, (err, res) => {
        if(err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY DEPARTMENT');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

// View employees by their manager's name
function viewByManager(){
   const query = `SELECT CONCAT(manager.first_name,'',manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
   FROM employee
   LEFT JOIN employee manager ON manager.id = employee,manager_id
   INNE JOIN department ON (department.id = role.department_id)
   ORDER BY manager;`;
   connection.query(query, (err, res) => {
        if(err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY MANAGER');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

// View employees 
function viewAllRoles(){
    const query = `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;
    connection.query(query, (err, res) => {
        if(err) throw err;
        console.log('\n');
        console.log('VIEW ALL ROLES');
        console.log('\n');
        console.table(res);9
        prompt();
    });
}

// Ask if user wants to remove an employee, update a role, or view all employees
// If yes to any of those, call the appropriate functions
function remove(input){
    const promptQ = {
        yes: "yes",
        no: "No I don't (view all employees on the main option)"
    };
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "An employee ID is required to continue forward. Do you know the employee's ID number?",
            chocies: [promptQ.yes, promptQ.no]
        }
    ])
    .then(answer => {
        if (input === 'delete' && answer.action === "yes"){
            removeEmployee();
        }else if(input === 'role' && answer.action === "yes"){
            updateEmployeeRole();
        }else{
            viewAllEmployees();
        }
    });
};

// Remove an employee from the database
async function removeEmployee(){
    const answer = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the ID of the employee that you want to remove: "
        }
    ]);
    connection.query(`DELETE FROM employee WHERE ?`,
        {
            id: answer.first
        },
        function (err){
            if (err) throw err;
        }
    )
    console.log('The employee has been removed from the database.');
    prompt();
};

// Prompt the user to enter an employees id number
function askForID(){
    return([
        {
            name: "name",
            type: "input",
            message: "What is the employee's ID number? "
        }
    ]);
};

// Prompt the user for a new employees name
// that they want to search the database for
// that specified employee
function askForName(){
    return ([
        {
            name: "first",
            type: "input",
            message: "Enter the first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter the last name: "
        }
    ]);
}


