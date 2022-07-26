const db = require('../services/db');
const { Applicant } = require('./applicant');
const { Applications } = require('./applications');

class register {
    // Attributes
    A_ID;
    Company_Name;
    Job_Title;
    Location = [];
    Status = [];
    SubmissionDate = [];
    LastUpdate = [];
    Documents = [];

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