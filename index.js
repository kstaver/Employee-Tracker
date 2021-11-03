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
    updateEmployeeRole: "Update employee role",
    updateEmployeeManager: "Update an employee's manager",
    viewAllRoles: "View all roles",
    addRole: "Add a role",
    addDepartment: "Add a department",
    exit: "Exit"
};

// Create a connection to the sql database 
// that we are using in this application
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    databse: "employees"
});

// Tests the connection between index.js and sql
// server
connection.connect(err => {
    if(err){
        throw err;
    }
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

// Add an employee to the database
async function addEmployee(){
    const addName = await inquirer.prompt(askForName());
    connection.query(`SELECT role.id, role.title FROM role ORDER BY role.id;`, async (err, res) => {
        if (err) throw err;
        const {role} = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: "What is the employee's role? "
            }
        ]);
        let roleId;
        for (const row of res){
            if(row.title === role){
                roleId = row.id;
                continue;
            }
        }
        connection.query(`SELECT * FROM employee`, async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: 'Choose the Manager of the employee: '
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none'){
                managerId = null;
            }else{
                for (const data of res){
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager){
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log('Employee has been added. Please view all employee to verify...');
            connection.query(
                `INSERT INTO employee SET ?`,
                {
                    first_name: addName.first,
                    last_name: addName.last,
                    role_id: roleId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();
                }
            );
        });
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

// Update an employee's role
async function updateEmployeeRole(){
    const employeeId = await inquirer.prompt(askForID());

    connection.query(`SELECT role.id, role.title FROM role ORDER BY role.id;`, async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: "What is the new employee's role? "
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role){
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw (err);
            console.log('Role has been updated!')
            prompt();
        });
    });
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

function addDepartment(){
    inquirer.prompt([{
        name: "name",
        type: "input",
        message:"What is the name of the department?",
        validate:function(value){
            if(isNaN(value) === false){
                return false;
            }
            return true;
        }
    }]).then(function(answer){
        connection.query(`INSERT INTO department SET ?`,
        {
            name: answer.name
        },
        function (err){
            if (err) throw err;
            console.log = "Department has been added."
        });
        prompt();
    });
}

function addRole(){
    inquirer.prompt({
        name: "title",
        type: "input",
        message: "What is the title of this role?",
        validate:function(value){
            if(isNaN(value) === false){
                return false;
            }
            return true;
        }
    }).then(function(answer){
        connection.query(` INSERT role INTO SET ?`,{
            title: "answer.title",
            salary: "answer.salary",
            department_id: "answer.department_id"
        },
        function (err){
            if (err) throw err;
            console.log = "Role has been added."
        });
        prompt();
    });
}
