// Get the functions in the db.js file to use
const db = require('../services/db');
const bcrypt = require("bcryptjs");

class User {

    // Id of the user
    id;

    // Name of the user
    Name;

    // Email of the user
    email;

    constructor(name,email) {
        this.Name=name;
        this.email = email;
    }
    
    // Get an existing user id from an email address, or return false if not found
    async getIdFromEmail(email)  {

        var sql = "SELECT id FROM User WHERE email = ?";
        console.log(sql);
        const result = await db.query(sql, [email]);
        console.log(email);
        // TO DO LOTS OF ERROR CHECKS HERE..
        if (JSON.stringify(result) != '[]') {
            this.id = result[0].id;
            return this.id;
        }
        else {
            return false;
        }
    }

    // Add a password to an existing user
    async setUserPassword(password) {
        const pw = await bcrypt.hash(password, 10);
        console.log(pw);
        var sql = "UPDATE User SET Password = ? WHERE id = ?"
        const result = await db.query(sql, [password, this.id]);
        return true;
    }
    
    // Add a new record to the users table    
    async addUser(password) {
        const pw = await bcrypt.hash(password, 10);
        var sql = "INSERT INTO User (Name,email, password) VALUES (? , ? , ?)";
        console.log(pw);
        const result = await db.query(sql, [this.Name,this.email, password]);
        console.log(result.insertId);
        this.id = result.insertId;
        return this.id;
    }

    // Test a submitted password against a stored password
    async authenticate(user_pass,email) {
        // Get the stored, hashed password for the user
        var sql = "SELECT password FROM User WHERE email = ?";
        var  result =  await db.query(sql, [email]);//.then(results => {return results[0].password});
        console.log(result[0].password);
        return result[0].password==user_pass;
   }
}

module.exports  = {
    User
}