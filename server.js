const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connectUtil = require('./utils/connectUtil');


// Create a connection to employees.sql 
const db = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "techBusiness",
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
});

console.log(`
++++++++++++++++++++++++
+   Employee Tracker   +
++++++++++++++++++++++++
`);

connectUtil.userChoice();