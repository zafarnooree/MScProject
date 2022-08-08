const db = require('../services/db');
const { User } = require('./user');

class register {
    // Attributes
    id;
    Name;
    email;

    constructor(Name) {
        this.Name = Name;
    }
    async addUser() {
        var sql = "INSERT INTO User(Name) Values(?)"
        console.log(result.insertName);
        this.Name = result.insertName;
        return this.Name;
    }
}

module.exports = {
    register
}