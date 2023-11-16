//imports the depedency
const mysql = require('mysql2');


//connects to mysql server
const db = mysql.createConnection(
    {
        host:'localhost',
        user: 'root',
        password: 'sA8LEY3',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

module.exports = db;
