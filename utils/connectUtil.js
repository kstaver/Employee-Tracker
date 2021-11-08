const mysql = require('mysql2/promise');
const cTable = require('console.table');
const inquirer = require('inquirer');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'techBusiness',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promptForInfo = {
    viewAllEmployees: "View all employees",
    viewAllDepartment: "View all employees by department",
    addEmployee: "Add an employee",
    removeEmployee: "Remove an employee",
    updateEmployee: "Update an employee",
    viewAllRoles: "View all roles",
    addRole: "Add a role",
    addDepartment: "Add a department",
    exit: "Exit"
};

// Prompt for user input
async function userChoice(){
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: "Welcome to a Random Tech Company's Employee Database. Please choose from the following options.",
        choices: [
            promptForInfo.viewAllEmployees,
            promptForInfo.viewAllDepartment,
            promptForInfo.viewAllRoles,
            promptForInfo.addEmployee,
            promptForInfo.removeEmployee,
            promptForInfo.updateEmployee,
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
            case promptForInfo.viewAllDepartment:
                viewByDepartment();
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
            case promptForInfo.updateEmployee:
                updateEmployeeRole();
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

async function viewAllEmployees(){
    const query = `SELECT employee.id, employee.first_name, employee.last_name, 
    role.title, department.name AS department, role.salary, 
    CONCAT(manager.first_name,'', manager.last_name) AS manager
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
        userChoice();
    });
}

async function viewAllDepartment(){
    const query = `SELECT department.name AS department, role.title, employee.id, 
    employee.first_name, employee.last_name
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
        userChoice();
    });
}

async function viewAllRoles(){
    const query = `SELECT role.title, employee.id, employee.first_name, 
    employee.last_name, department.name AS department
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
        userChoice();
    });
}

async function askForName(){
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?",
            validate: (value) => {
                if(value.length > 0){
                    return true;
                } else{
                    return false;
                }
            }
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the employee's last_name?",
            validate: (value) =>{
                if(value.length > 0){
                    return true;
                }else{
                    return false;
                }
            }
        },
    ])
    .then((answer) => {
        const sqlName = (`INSERT INTO employee
        SET first_name = "${answer.first_name}", last_name = "${answer.last_name}"`);
        connection.query(sqlName, (err, res) => {
            if(err) throw err;
            console.log(`\n${answer.first_name} ${answer.last_name} has been added to the database.`);
            userChoice();
        });
    })
}

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
                    userChoice();
                }
            );
        });
    });
}

async function updateEmployee(){
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name FROM employee ORDER BY employee.id;`, async (err, res) => {

        if (err) throw err;
        const {employee} = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                choices: () => res.map(res => `${res.id} ${res.first_name} ${res.last_name}`),
                message: "Which employee would you liek to update?"
            }
        ]);
        let employeeId;
        for (const row of res){
            if(row.id === employee){
                employeeId = row.id;
                continue;
            }
        }
        connection.query(`SELECT role.id, role.title FROM role ORDER BY role.id;`, async (err, res) => {
            if (err) throw err;
            const {role} = await inquirer.prompt([
                {
                    name: 'role'
                }
            ]);
            let roleId;
            for (const row of res){
                if(row.title === role){
                    roleId = row.id;
                    continue;
                }
            }
            connection.query(`SELECT * FROM employee`, (err, res) =>{
                if(err) throw err;
                let choices = res.map(res => `${res.first_name} ${res.last_name}`);
                choices.push('none');
                const {manager} = await inquirer.prompt([
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
                console.log('Employee has been updated. Please view all employee to verify...');
            });
        });
    });
}

async function addRole(){    
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the title of this role?",
            validate: (value) => {
                if(isNaN(value) === false){
                    return false;
                }
                return true;
            }
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary of this role?",
            validate: (value) => {
                if(isNaN(value) === false){
                    return false;
                }
                return true;
            }
        },
        {
            name: "department_name",
            type: "list",
            message: "Chose a department: ",
            choices: department,
            validate: (value) => {
                if(value === ''){
                    return false;
                }
                return true;
            }
        }
    ]).then(function(answer){
        const sqlRole = (`INSERT INTO role
        SET title = "${answer.title}",
        salary = "${answer.salary}",
        department_id = (SELECT id FROM department 
        WHERE name = "${answer.department_name}")`);

        connection.query(sqlRole, (err,res) => {
            if (err) throw err;
            console.log = "Role has been added.";
        });
        userChoice();
    });
}

async function addDepartment(){
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the new department?"
        }
    ]).then((answer) => {
        const sqlDepartment = (`INSERT INTO department
        SET name = "${answer.name}"`);

        connection.query(sqlDepartment, (err, res) => {
            if(err) throw err;
            console.log = "Department has been added.";
        });
    });
}

/*async function remove(input){
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

async function removeEmployee(){
    const answer = await inquirer.prompt([
    {
        name: "first",
        type: "input",
        message: "Enter the ID of the employee that you want to remove: "
    }]);
    connection.query(`DELETE FROM employee WHERE ?`,
        {
            id: answer.first
        },
        function (err){
            if (err) throw err;
        }
    )
    console.log('The employee has been removed from the database.');
    userChoice();
};*/

module.exports = {viewAllEmployees, viewAllRoles, viewAllDepartment, addEmployee, updateEmployee, addRole, addDepartment, userChoice}; //remove, removeEmployee};




