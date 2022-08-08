const db = require('../services/db');
const { User } = require('./user');
const { Applications } = require('./applications');


class Journal {
    // Attributes
    J_ID;
    DayOfWeek;
    I_Notes;

    constructor(DayOfWeek, I_Notes, Feedback) {
        this.DayOfWeek = DayOfWeek;
        this.I_Notes = I_Notes;
        this.Feedback = Feedback;
    }

    async getJournal() {
        var sql = "SELECT * from Journal where J_ID = ?"
        const results = await db.query(sql, [this.id]);
        this.DayOfWeek = results[0].DayOfWeek
        this.I_Notes = results[0].I_Notes;
        this.Feedback = results[0].Feedback;
    }
}

module.exports = {
    Journal
}