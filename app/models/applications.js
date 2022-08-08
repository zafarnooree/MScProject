const db = require('../services/db');
const { User } = require('./user');
const { Journal } = require('./journal');


class Applications {
    // Attributes
    A_ID;
    Company_Name;
    Job_Title;
    Location;
    Status = [];
    SubmissionDate;
    LastUpdate;
    Documents = [];

    constructor(A_ID) {
        this.A_ID = A_ID;
    }

    //Get the user name from the database
    async getApplicationDetails() {
        if (typeof this.Company_Name !== 'string') {
            var sql = "SELECT * from Applications where A_ID = ?"
            const results = await db.query(sql, [this.A_ID]);
            this.Company_Name = results[0].Company_Name;
        }
    }

    //Get the user name from the database
    async getUserDetails() {
        if (typeof this.Name !== 'string') {
            var sql = "SELECT * from User where id = ?"
            const results = await db.query(sql, [this.id]);
            this.Name = results[0].Name;
        }
    }

    //Get the user profile photo from the database
    async getUserImage() {
        if (typeof this.image_path !== 'string') {
            var sql = "SELECT image_path from image where id = ?"
            const results = await db.query(sql, [this.id]);
            this.image_path = results[0].image_path;
        }
    }

    //Get the application details for the user
    async getUserApplications() {
        var sql = "SELECT Applications.A_ID, Applications.Company_Name, Applications.Job_Title, Applications.Location, Applications.Status, Applications.SubmissionDate, Applications.LastUpdate, Applications.Documents, \
        FROM User \
        JOIN Applications ON User.id = Applications.A_ID \
        JOIN Journal ON Journal.J_ID = Applications.A_ID \
        WHERE User.id = ?;"
        const results = await db.query(sql, [this.id]);
        for(var row of results) {
            this.applications.push(new Applications(row.Company_Name, row.Job_Title, row.Location, row.Status, row.SubmissionDate, row.LastUpdate, row.Documents));
        }
    }

    async getUserJournal() {
        var sql = "SELECT Journal.J_ID, Journal.DayOfWeek, Journal.I_Notes, Journal.Feedback \
        FROM User \
        JOIN Journal ON Journal.J_ID = User.id \
        WHERE User.id = ?;"
        const results = await db.query(sql, [this.id]);
        for (var row of results) {
            this.journal.push(new Journal(row.DayOfWeek, row.I_Notes, row.Feedback));
        }

    }

}

module.exports = {
    Applications
}