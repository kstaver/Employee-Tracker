const mysql = require('mysql/promise');

// Create a connection to employees.sql 
const db = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    databse: "employees"
});


// Tests the connection between index.js and sql
// server
connection.connect(err => {
    if(err) throw err;
    prompt();
});

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

// Add a new department to the database
async function addDepartment(){
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

// Add a new role to the database
async function addRole(){
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

// Retrieve roles