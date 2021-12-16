// Non async functions
const figlet = require('figlet');
const inquirer = require('inquirer');
const mysql = require("mysql2");
const{ viewEmployees, viewDepartments, viewRoles, getManagers, addEmployee, 
    addDepartment, addRole, updateEmployee } = require("./queries");

// Initialize main menu and displays a title message
const init = () => {
    figlet("Welcome to the Employer Tracker Application!", async (err, data) =>{
        if(err){
            console.log(err);
        }else{
            console.log(data);
            await mainMenu();
        }
    });
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
                "View all managers",
                new inquirer.Separator(),
                "Add an employee",
                "Add a department",
                "Add a role",
                new inquirer.Separator(),
                "Update an employee",
                new inquirer.Separator(),
                "Exit",
                new inquirer.Separator("***End***")
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
                    const results = await viewEmployees(table);
                    console.table(results);
                    break;
                }
                case "View all departments":{
                    table = "department";
                    const results = await viewDepartments(table);
                    console.table(results);
                    break;
                }
                case "View all roles":{
                    table = "role";
                    const results = await viewRoles(table);
                    console.table(results);
                    break;
                }
                case "View all Managers":{
                    table = "manager";
                    const results = await getManagers(table);
                    console.table(results);
                }
                default:{
                    throw new Error("Invalid choice");
                }
        }
        await mainMenu();
        } else if (
            choices.options === "Add an employee" ||
            choices.options === "Add a department" ||
            choices.options === "Add a role"
        ){
            let table;
            switch (choices.options){
                case "Add an employee":{
                    table = "employee";
                    const results = await addEmployee(table);
                    console.table(results);
                    break;
                }
                case "Add a department":{
                    table = "department";
                    const results = await addDepartment(table);
                    console.table(results);
                    break;
                }
                case "Add a role":{
                    table = "role";
                    const results = await addRole(table);
                    console.table(results);
                    break;
                }
                default:{
                    throw new Error("Invalid choice.");
                }
            }
            await mainMenu();
        } else if (choices.options === "Update an employee"){
            let updateValue = "employee";
            await updateEmployee(updateValue);
            await mainMenu();
        } else if (choices.options === "Exit"){
            process.exit();
        }
    } catch (err){
        console.log(err);
    }
};

init();
