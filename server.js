// Non async functions
const inqurier = require('inquivier');
const mysql = require("mysql2");
const{ viewEmployees, getAllManagers, addEmployee, 
    addDepartment, addRole, updateEmployee } = require("./inquries");