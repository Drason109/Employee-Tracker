//Import depencies
const inquirer = require('inquirer');
const db = require('./db/server');

//connects to the server
db.connect(err => {
    if(err) throw err;
    console.log("Database connected.");
    promptsChoices();
})

//function that prompts the main question
function promptsChoices(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Department",
                "Add Department",
                "Log Out"
            ],
            name: "mainmenu",               
        }
    ]).then((answer) => {
        if(answer.mainmenu === 'View All Employees'){//Show all employees in the database
            db.query(`SELECT * FROM employee`, (err, result) => {
                if(err) throw err;
                console.log("Viewing all Employees: ");
                console.table(result);
                promptsChoices();
            })
        } else if(answer.mainmenu === 'Add Employee'){//Adds an employees database
                addEmployee();
            
        }else if(answer.mainmenu === "Update Employee Role"){// Update their role in the department
            updateEmployeeRole();
        }else if(answer.mainmenu === 'View All Roles'){//show all roles in the department
            db.query(`SELECT * FROM role`, (err, result) => {
                if(err) throw err;
                console.log("Viewing all roles: ");
                console.table(result);
                promptsChoices();
            })
        }else if(answer.mainmenu === 'Add Role'){//Adds a role in the department
                addRole();
        }else if(answer.mainmenu === 'View All Department'){//show all the department in the database
            db.query(`SELECT * FROM department`, (err, result) => {
                if(err) throw err;
                console.log("Viewing all Departments: ");
                console.table(result);
                promptsChoices();
            })
        }else if(answer.mainmenu === 'Add Department'){//add a department in the database
            addDepartment();
        }else if(answer.mainmenu === 'Log Out'){//ends the connection to the server
            db.end();
            console.log("Good-Bye!");
        }
    })
};

function addEmployee(){// Function that gives prompt to add an employee
    db.query(`SELECT * FROM employee, role`, (err, result) => {
        if(err) throw err;

        inquirer.prompt([
            {
             type: "input",
             message: "What is the employee's first name?",
             name: "firstname",
             validate: firstnameInput => {
                if(firstnameInput) {
                    return true;
                }else{
                    console.log("Add a First Name");
                    return false;
                 }
                }
            },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastname",
            validate: lastnameInput => {
                if(lastnameInput){
                    return true;
                }else{
                    console.log("Add a Last Name");
                    return false;
                }
            }
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "role",
            choices: () => {
                var array = [];
                for(var i = 0;i < result.length; i++){
                    array.push(result[i].title);
                }
                var newTitle = [...new Set(array)];
                return newTitle;
            }
        },
        {
            type: "input",
            message: "Who is the Employee's manager?",
            name: "manager",
            validate: managerInput => {
                if(managerInput){
                    return true;
                }else{
                    console.log("Name a Manager to assign");
                    return false;
                }
            }
        }
    ]).then((answers) => {//Adds to the database when user has answered
        for(var i = 0;i <result.length; i++){
            if(result[i].title === answers.role){
                var role = result[i];
            }
        }
        
        db.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id)
            VALUES (?,?,?,?)`,  [answers.firstname,answers.lastname, role.id, answers.manager.id], (err, result) => {
                if(err) throw err;
                console.log(`Added ${answers.firstname} ${answers.lastname}to the database.`);
                promptsChoices();
            });
        })
    });

}


function addRole(){// function that adds a role to the department
    db.query('SELECT * FROM department', (err, result) => {
        if(err) throw err;
  
    inquirer.prompt([
        {
            type: 'input',
            message: "What is the name of the role?",
            name: "role",
            validate: roleInput => {
                if(roleInput){
                    return true;
                }else {
                    console.log("Add a role");
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "What is the salary of the role?",
            name: "salary",
            validate: salaryInput => {
                if(salaryInput){
                    return true;
                }else{
                    console.log("Add a Salary Amount");
                    return false;
                }
            }

        },
        {
            type: "list",
            message: "Which department does the role belong too",
            name: "department",
            choices: () => {
                var array = [];
                for(var i = 0;i < result.length; i++){
                    array.push(result[i].name);
                }
                return array;
            }
        }

      ]).then((answer) => {//add the response the database
        for(var i = 0;i < result.length; i++) {
            if(result[i].name === answer.department){
                var department = result[i];
                }
            }

            db.query(`INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`, [answer.role, answer.salary, department.id], (err,result) => {
            if(err) throw err;
            console.log(`added ${answer.role} to the database`);
            promptsChoices();
            });
            
        });
        
    });
}

function addDepartment() {// function that prompts to add a department
    db.query(`SELECT * FROM department`, (err,result) => {
        if(err) throw err;
     inquirer.prompt([
         {
            type: "input",
            message: "What is the name of the department?",
            name: "department",
            validate: departmentInput => {
                if(departmentInput){
                    return true;
                }else{
                    console.log("Add a department");
                    return false;
                }
            }
            }
        ]).then((answers) => {//adds the response to the database
        db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
            if(err) throw err;
            console.log(`Added ${answers.department} to the database.`);
            promptsChoices();
            });
        })
    });
}


function updateEmployeeRole() {//function that prompts when updating a role
    db.query(`SELECT * FROM employee, role`, (err, result) => {
        if(err) throw err;

        inquirer.prompt([
            {
                type: "list",
                message: "Which employees role do you want change?",
                name: "employee",
                choices: () => {
                    var array = [];
                    for(var i = 0; i < result.length; i++) {
                        array.push(result[i].last_name);
                    }
                    var employeeArray = [...new Set(array)];
                    return employeeArray;
                }
            },
            {
                type: "list",
                message: "What is their new role?",
                name: "role",
                choices: () => {
                    var array = [];
                    for(var i = 0; i < result.length; i++){
                        array.push(result[i].title);
                    }
                    var updatedArray = [...new Set(array)];
                    return updatedArray;
                }
            }
        ]).then((answers) => {//adds the new role to employee
            for(var i = 0;i < result.length; i++) {
                if(result[i].last_name === answers.employee){
                    var name = result[i];
                }
            }

            for(var i = 0; i < result.length; i++){
                if(result[i].title === answers.role){
                    var role = result[i];
                }
            }

            db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                if(err) throw err;
                console.log(`Updated ${answers.employee} role to the database.`);
                promptsChoices();
            });
        })
    });
}



