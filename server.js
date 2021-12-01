// Non async functions
const inquirer = require('inquirer');
const inqurier = require('inquivier');
const mysql = require("mysql2");
const{ viewEmployees, getAllManagers, addEmployee, 
    addDepartment, addRole, updateEmployee } = require("./inquries");

// Initialize main menu and disaply a title message
const init = () => {
    if (err){
        console.error(err);
    }else{
        console.log("Welcome to the Employer Tracker Application!");
        await mainMenu();
    }
};

const mainMenu = async () => {
    try{
        const choices = await inquirer.prompt({
            type: "list",
            name: "options",
            message: "What would you like to do?",
            choices: [
                "View all employees",
                "View all departments",
                "View all roles",
                new inquirer.Separator(),
                "Add an employee",
                "Add a department",
                "Add a role",
                new inquirer.Separator(),
                "Update an employee",
                new inquirer.Separator(),
                "Exit",
                new inquirier.Separator("***End***")
            ],
        });
        console.log('\n');
        if(){
            
        }
    } catch(e){
        console.log(err);
    }
};

init();