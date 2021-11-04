const inquirer = require('inquirer');
const mysql = require('mysql');
const { async } = require('rxjs');

// Prompts for user choice
const promptForInfo = {
    viewAllEmployees: "View all employees",
    viewByDepartment: "View all employees by department",
    viewByManager: "View all employees under a specific manager",
    addEmployee: "Add an employee",
    removeEmployee: "Remove an employee",
    updateEmployeeRole: "Update employee role",
    updateEmployeeManager: "Update an employee's manager",
    viewAllRoles: "View all roles",
    addRole: "Add a role",
    addDepartment: "Add a department",
    exit: "Exit"
};

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
            promptForInfo.updateEmployeeRole,
            promptForInfo.updateEmployeeManager,
            promptForInfo.addRole,
            promptForInfo.addDepartment,
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
            case promptForInfo.updateEmployeeRole:
                updateEmployeeRole();
                break;
            case promptForInfo.updateEmployeeManager:
                updateEmployeeManager();
                break;
            case promptForInfo.addRole:
                addRole();
                break;
            case promptForInfo.addDepartment:
                addDepartment();
                break;
            case promptForInfo.exit:
                connection.end();
                break;
        }
    });
}


