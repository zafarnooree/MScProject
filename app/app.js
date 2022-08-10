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
const { Applications } = require("./models/applications");
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
app.get("/all-applications", function(req, res) {
    // Prepare an SQL query that will return all rows from the teacher_table
    var sql = 'select * from Applications';
    db.query(sql).then(results => {
        res.render('all-applications', {data:results});
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
    resultApplications = await getapplications.getAllApplications();
    res.render('user', {'User':user, 'Applications':resultApplications});
});

// Create route for the calendar
// Here we have a page which demonstrates how to both input dates and display dates
app.get("/user", async function(req, res) {
    // Get all the dates from the db to display
    // NB Move this to a model that is appropriate to your project
    sql = "SELECT * from applications";
    // We could format dates either in the template or in the backend
    dates = [];
    results = await db.query(sql);
    // Loop through the results from the database
    for (var row of results) {
        // For some reason the dates are fomatted as jsDates. I think thats the Mysql2 library at work!
        dt = DateTime.fromJSDate(row['date']);
        // Format the date and push it to the row ready for the template
        // NB Formatting could also be done in the template
        // NB date formats are usually set up to work throughout your app, you would not usually set this in every row.
        // you could put this in your model.
        dates.push(dt.toLocaleString(DateTime.DATE_HUGE));
    }
    // Render the calendar template, injecting the dates array as a variable.
    res.render('applications', {dates: dates});
});

// Capture the date input and save to the db
app.post('/set-date', async function (req, res) {
    params = req.body.date;
    console.log(params);
    //construct a date object from the submitted value - use a library
    var inputDate = DateTime.fromFormat(params, 'yyyy-M-dd');
    console.log(inputDate);
    // Add the date: NB this should be in a model somewhere
    sql = "INSERT into test_applications (date) VALUES (?)";
    try {
        await db.query(sql, [inputDate.toSQLDate()]);
    } catch (err) {
        console.error(`Error while adding date `, err.message);
        res.send('sorry there was an error');
    }
    res.send('date added');
});



//**********************************************************************************

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});