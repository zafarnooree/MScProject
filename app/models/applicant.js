const db = require('../services/db');
const { User } = require('./user');
const { Applications } = require('./applications');


class Applicant {
    // Attributes
    U_ID;
    Name;
    email;

    constructor(U_ID) {
        this.U_ID = U_ID;
    }

     //Get the user name from the database
     async getUserDetails() {
        if (typeof this.Name !== 'string') {
            var sql = "SELECT * from Applicant where U_ID = ?"
            const results = await db.query(sql, [this.U_ID]);
            this.Name = results[0].Name;
        }
    }

    //Get the user profile photo from the database
    async getUserImage() {
        if (typeof this.image_path !== 'string') {
            var sql = "SELECT image_path from image where U_ID = ?"
            const results = await db.query(sql, [this.U_ID]);
            this.image_path = results[0].image_path;
        }
    }

    //Get the application details for the applicant
    async getApplicantApplications() {
        var sql = "SELECT Applications.A_ID, Applications.Company_Name, Applications.Job_Title, Applications.Location, Applications.Status, Applications.SubmissionDate, Applications.LastUpdate, Applications.Documents, \
        FROM Applicant \
        JOIN Applications ON Applicant.U_ID = Applications.A_ID \
        JOIN Journal ON Journal.J_ID = Applications.A_ID \
        WHERE Applicant.U_ID = ?;"
        const results = await db.query(sql, [this.U_ID]);
        for(var row of results) {
            this.applications.push(new Applications(row.Company_Name, row.Job_Title, row.Location, row.Status, row.SubmissionDate, row.LastUpdate, row.Documents));
        }
    }

    async getApplicantJournal() {
        var sql = "SELECT Journal.J_ID, Journal.DayOfWeek, Journal.I_Notes, Journal.Feedback \
        FROM Applicant \
        JOIN Journal ON Journal.J_ID = Applicant.U_ID \
        WHERE Applicant.U_ID = ?;"
        const results = await db.query(sql, [this.U_ID]);
        for (var row of results) {
            this.journal.push(new Journal(row.DayOfWeek, row.I_Notes, row.Feedback));
        }

    }

}

module.exports = {
    Applicant
}