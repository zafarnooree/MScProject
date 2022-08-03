const db = require('../services/db');
const { User } = require('./user');
const { Applicant } = require('./applicant');


class Applications {
    // Attributes
    A_ID;
    Company_Name;
    Job_Title;
    Location = [];
    Status = [];
    SubmissionDate = [];
    LastUpdate = [];
    Documents = [];

    constructor(A_ID) {
        this.A_ID = A_ID;
    }

    //Get the user name from the database
    async getApplicationDetails() {
        if (typeof this.Name !== 'string') {
            var sql = "SELECT * from Applications where A_ID = ?"
            const results = await db.query(sql, [this.A_ID]);
            this.Name = results[0].Name;
        }
    }

}

module.exports = {
    Applications
}