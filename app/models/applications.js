const db = require('../services/db');
const { User } = require('./user');
const { Journal } = require('./journal');
const { compare } = require('bcryptjs');


class Applications {
    // Attributes
    User_id;
    Company_Name;
    Job_Title;
    Location;
    Status = [];
    SubmissionDate;
    LastUpdate;
    DocumentName;
    DocumentData;
    

    constructor(User_id,Company_Name, Job_Title, Location, Status, SubmissionDate, LastUpdate,DocumentName) {
        //this.A_ID = A_ID;
        this.User_id=User_id;
        this.Company_Name=Company_Name;
        this.Job_Title=Job_Title;
        this.Location=Location;
        this.Status=Status;
        this.SubmissionDate=SubmissionDate;
        this.LastUpdate=LastUpdate;
        this.DocumentName=DocumentName;
       
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
        var sql = "SELECT Applications.A_ID, Applications.Company_Name, Applications.Job_Title, Applications.Location, Applications.Status, Applications.SubmissionDate, Applications.LastUpdate, Applications.Filename, \
        FROM Applications \
        JOIN Applications ON Applications.id = User.id \
        JOIN Journal ON Journal.A_ID = Applications.A_ID \
        WHERE User.id = ?;"
        const results = await db.query(sql, [this.id]);
        for(var row of results) {
            this.Applications.push(new Applications(row.Company_Name, row.Job_Title, row.Location, row.Status, row.SubmissionDate, row.LastUpdate, row.Filename));
        }
    }
    async getUserApplications_new(user_id){
        var sql = 'select A_ID,Company_Name, Job_Title, Location, Status, DATE_FORMAT(SubmissionDate, "%D %b, %Y") SubmissionDate,DATE_FORMAT(LastUpdate, "%D %b, %Y") LastUpdate, Documents,Filename from Applications Where id = ?';
        const results = await db.query(sql, [user_id]);
       
        return results;
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
    async addApplication(fileData) {
        var sql = "INSERT INTO Applications (id,Company_Name, Job_Title, Location, Status, submissionDate, LastUpdate, Documents,Filename) VALUES (? , ? , ? , ? , ? , ? , ?,?,?)";
        console.log(this.User_id);
        const result = await db.query(sql, [this.User_id,this.Company_Name,this.Job_Title, this.Location, this.Status, this.SubmissionDate, this.LastUpdate, fileData,this.DocumentName]);
        console.log(result.insertId);
        this.id = result.insertId;
        return this.id;
    }
    async updateApplication(fileData,Aid) {
        var sql = "UPdate   Applications SET id=?,Company_Name=?, Job_Title=?, Location=?, Status=?, submissionDate=?, LastUpdate=?, Documents=?,Filename=? Where A_ID=?";
        console.log(this.User_id);
        const result = await db.query(sql, [this.User_id,this.Company_Name,this.Job_Title, this.Location, this.Status, this.SubmissionDate, this.LastUpdate, fileData,this.DocumentName,Aid]);
        console.log(result.insertId);
        this.id = result.insertId;
        return this.id;
    }
    
}

module.exports = {
    Applications
}