'use strict';

const mysql = require('mysql');
const inquirer = require('inquirer');
const { async } = require('rxjs');
require('console.table');

// Prompts for user choice
const promptForInfo = {

};

// Create a connection to the sql database 
// that we are using in this application
const connection = mysql.createConnection({

});

// Tests the connection between index.js and sql
// server
connection.connect(err => {
    if(err) throw err;
});

// Prompt for user input
function prompt(){

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
async function updateRmployeeRole(){

}

// Prompt the user for a new employees name
// that they want to add to the database
function askForName(){

}