'use strict';

const mysql = require('mysql');
const inquirer = require('inquirer');
const { async } = require('rxjs');
require('console.table');

// Prompts for user choice
const promptForInfo = {
    viewAllEmployees: "View all employees",
    viewByDepartment: "View all employees by department",
    viewByManager: "View all employees under a specific manager",
    addEmployee: "Add an employee",
    removeEmployee: "Remove an employee",
    updateRole: "Update employee role",
    updateEmployeeRole: "Update an employee's manager",
    viewAllRoles: "View all roles",
    exit: "Exit"
};

// Create a connection to the sql database 
// that we are using in this application
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "crazycatlady",
    databse: 'employees'
});

// Tests the connection between index.js and sql
// server
connection.connect(err => {
    if(err) throw err;
    prompt();
});

// Prompt for user input
function prompt(){
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: "Welcome to the Employees Database. Please choose from the following options.",
        choices: [
            promptForInfo.viewAllEmployees,
            promptForInfo.viewByDepartment,
            promptForInfo.viewByManager,
            promptForInfo.viewAllRoles,
            promptForInfo.addEmployee,
            promptForInfo.removeEmployee,
            promptForInfo.updateRole,
            promptForInfo.exit
        ]
    })
    .then(answer =>{
        console.log('answer', answer);
        switch(answer.action){
            case promptForInfo.viewAllEmployees:
                viewAllEmployees();
                break;
            case promptForInfo.viewByDepartment:
                viewByDepartment();
                break;
            case promptForInfo.viewByManager:
                viewByManager();
                break;
            case promptForInfo.viewAllRoles:
                viewAllRoles();
                break;
            case promptForInfo.addEmployee:
                addEmployee();
                break;
            case promptForInfo.removeEmployee:
                removeEmployee();
                break;
            case promptForInfo.updateRole:
                updateRole();
                break;
            case promptForInfo.exit:
                connection.end();
                break;
        }
    });
}

// View all employees option
function viewAllEmployees(){
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name
    AS department, role.salary, CONCAT(manager.first_name,'',manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`
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
    ORDER BY department.name;`
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
        console.log('VIEW EMPLOYEE BY MANAGER');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

// Add an employee to the database
async function addEmployee(){

}

// Remove 
function remove(input){

};

// Remove an employee from the database
async function removeEmployee(){

}

// Prompt the user to enter an employees id
function askForID(){

}

// Update an employee's role
async function updateEmployeeRole(){

}

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