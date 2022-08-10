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
/* const { Applications } = require("./models/applications"); */
const { User } = require("./models/user");

// Create a route for root - /
app.get("/", function(req, res) {
    res.render('homepage');
});

// Route for 'homepage.pug'
app.get('/homepage', function (req, res) {
    res.render('homepage');
});

// Create a route for 'index'
app.get("/index", function(req, res) {
    res.render("index",
        {'title':'Profile Page', 'heading': 'heading'});
});


// Create a route for testing the db
app.get("/all-applications/:uid", function(req, res) {
    params = req.params;
    // Prepare an SQL query that will return all rows from the teacher_table
    var sql = 'select * from Applications WHERE id = ?';
    db.query(sql, [params.uid]).then(results => {
        res.render('all-applications', {applications:results});
    });
});

// Route for 'register.pug'
app.get('/register', function (req, res) {
    res.render('register');
});

// Route for 'account.pug'
app.get('/account', function (req, res) {
    res.render('account');
});

// Set password route
app.post('/set-password', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        id = await User.getIdFromEmail();
        if (id) {
            // If a valid, existing user is found, set the password and redirect to the users profile page
            await User.setUserPassword(params.password);
            res.redirect('/user/' + id);
        }
        else {
            // If no existing user is found, add a new one
            newId = await User.addUser(params.email);
            res.send('Perhaps a page where a new user sets a programme would be good here');
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
app.post('/newentry', function (req, res) {
    console.log('code here to add to the database');

});

// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        id = await user.getIdFromEmail();
        if (id) {
            match = await user.authenticate(params.password);
            if (match) {
                // Set the session for the user
                req.session.id = id;
                req.session.loggedIn = true;
                console.log(req.session);
                res.redirect('/user/' + id);
            }
            else {
                // TODO improve the user journey here
                res.send('invalid password');
            }
        }
        else {
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


app.get("/user/:id", async function(req, res) {
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