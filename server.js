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

// Main Menu which deisplays a list of options for a user to choose from
// and calls the appropriate function for each chocie
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
                "View all Managers",
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
        if(
            choices.options === "View all employees" ||
            choices.options === "View all departments" ||
            choices.options === "View all roles" ||
            choices.options === "View all Managers"
        ){
            let table;
            switch (choices.options){
                case "View all employees":{
                    table = "employee";
                    break;
                }
                case "View all department":{
                    table = "department";
                    break;
                }
                case "View all roles":{
                    table = "role";
                    break;
                }
                case "View all Managers":{
                    table = "manager";
                }
                default:{
                    throw new Error("Invalid choice");
                }
        }
        const results = await viewEmployees(table);
        console.table(results);
        await mainMenu();
        } else if (
            choices.options === "Add an employee" ||
            choices.options === "Add a department" ||
            choices.options === "Add a role"
        ){
            let table;
            switch (choices.options){
                case "Add an employee":{
                    table = addEmployee();
                    break;
                }
                case "Add a department":{
                    table = addDepartment();
                    break;
                }
                case "Add a role":{
                    table = addRole();
                    break;
                }
                default:{
                    throw new Error("Invalid choice.");
                }
            }
            await addEmployee(table);
            await addDepartment(table);
            await addRole(table);
            await mainMenu();
        } else if (choices.options === "Update an employee"){
            let updateValue = "employee";
            await updateEmployee(updateValue);
            await mainMenu();
        } else if (choices.options === "Exit"){
            process.exit();
        }
    } catch (e){
        console.log(err);
    }
};

init();
