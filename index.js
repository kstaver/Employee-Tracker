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
        message: "Wleomce to the Employees Database. Please choose from the following options.",
        choices[
            promptForInfo.viewAllEmployees,
            promptForInfo.viewByDepartment,
            promptForInfo.viewByManager,
            promptForInfo.viewAllRoles,
            promptForInfo.addEmployee,
        ]
    });
}

// View all employees option
function viewAllEmployees(){

}

// View employees by department
function viewByDepartment(){

}

// View employees by their manager's name
function viewByManager(){

}

// View employees 
function viewAllRoles(){

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