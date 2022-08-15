// Import express.js
const express = require("express");
// Create express app
var app = express();
// Add static files location
app.use(express.static("static"));

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Add the luxon date formatting library
//const { DateTime } = require("luxon");

//***********************************************************************************

// We require the db.js file to set up the database connection.
const db = require('./services/db');
app.use(express.urlencoded({ extended: true }));

//Get the models
//const { Applications } = require("./models/applications");
const { User } = require("./models/user");
const { Applications } = require("./models/applications");

// Create a route for root - /
app.get('/', function(req, res) {
    res.render('homepage');
});

// Route for 'homepage.pug'
app.get('/homepage', function (req, res) {
    res.render('homepage');
});

// Create a route for 'profile.pug'
app.get('/profile', function (req, res) {
    res.render('profile');
});

// Create a route for 'journal.pug'
app.get('/journal', function (req, res) {
    res.render('journal');
});

// Create a route for testing the db
app.get('/all-applications', function(req, res) {
    // Prepare an SQL query that will return all rows from the applications_table
    var sql = 'select * from Applications';
    db.query(sql).then(results => {
        res.render('all-applications', {data:results});
    });
});

// Route for 'register.pug'
app.get('/register', function (req, res) {
    res.render('register');
});

// Set password route
app.post('/set_password', async function (req, res) {
    params = req.body;
    var user = new User(params.name,params.email);
    console.log(params.email);
    try {
        id = await user.getIdFromEmail();
        if (id) {
            // If a valid, existing user is found, set the password and redirect to the users profile page
            await user.setUserPassword(params.password);
            res.redirect('/profile/' + id);
        }
        else {
            // If no existing user is found, add a new one
            newId = await user.addUser(params.password);
            res.send('register');
        }
    } catch (err) {
        console.error(`Error while adding password `, err.message);
    }
});

// Route for 'login.pug'
app.get('/login', function (req, res) {
    res.render('login');
});

// Route for 'newentry.pug'
app.get('/newentry', function (req, res) {
    res.render('newentry');
});

//Route to recieve new entry form posting
app.post('/newentry', async function (req, res) {
    params = req.body;
    var newapp = new Applications(params.Company_Name, params.Job_Title, params.Location, params.Status, params.SubmissionDate, params.LastUpdate, params.Documents)
    console.log(params.A_ID);

});

// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    params = req.body;
    var user = new User(params.email, params.password);
    console.log(params.email);
    try {
        id = await user.getIdFromEmail();
        if (id) {
            match = await user.authenticate(params.password);
            if (match) {
                // Set the session for the user
                req.session.id = id;
                req.session.loggedIn = true;
                console.log(req.session);
                res.redirect('/profile/' + id);
            }
            else {
                // Checking the validity of the password
                res.send('invalid password');
            }
        }
        else {
            // Checking the validity of the email
            res.send('invalid email');
        }
    } catch (err) {
        console.error(`Error while comparing `, err.message);
    }
});

// Route for Logout
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
  });

app.get("/all-applications/:id", async function(req, res) {
    var id = req.params.id;
    //Create a user profile with ID passed
    var user = new User(id);
    await user.getUserDetails();
    await user.getUserImage();
    await user.getUserApplications();
    await user.getUserJournal();
    resultApplications = await getApplications.getAllApplications();
    res.render('user', {'User':user, 'Applications':resultApplications});
});

//**********************************************************************************

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});