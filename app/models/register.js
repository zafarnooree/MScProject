const db = require('../services/db');
const { User } = require('./user');
const { Applicant } = require('./applicant');

class register {
    // Attributes
    U_ID;
    Name;
    email;

    constructor(Name) {
        this.Name = Name;
    }
    async addApplicant() {
        var sql = "INSERT INTO User(Name) Values(?)"
        console.log(result.insertName);
        this.Name = result.insertName;
        return this.Name;
    }
}

module.exports = {
    register
}