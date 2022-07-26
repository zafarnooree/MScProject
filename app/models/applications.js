const db = require('../services/db');
const { Applicant } = require('./applicant');
const { Applications } = require('./applications');


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
    async getUserDetails() {
        if (typeof this.Name !== 'string') {
            var sql = "SELECT * from Application where A_ID = ?"
            const results = await db.query(sql, [this.A_ID]);
            this.Name = results[0].Name;
        }
    }

    //Get the user profile photo from the database
    async getUserImage() {
        if (typeof this.image_path !== 'string') {
            var sql = "SELECT image_path from image where A_ID = ?"
            const results = await db.query(sql, [this.A_ID]);
            this.image_path = results[0].image_path;
        }
    }


}

module.exports = {
    Applications
}