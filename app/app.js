// Import express.js
const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const http = require('http');
var bodyParser= require("body-parser");
const fileUpload = require('express-fileupload');

// Find the media file type
var mime = require('mime');

// Create express app
var app = express();
var logged_id;
// Add static files location
app.use(express.static("static"));
app.use(fileUpload());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// Session authentication router
const router =express.Router();
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
    }));
    // Used to get cookie data
    app.use(cookieParser());

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Add the luxon date formatting library
const { DateTime } = require("luxon");

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

// Route for 'search.pug'
app.get('/search', function (req, res) {
    res.render('search');
});

// Create a route for 'profile.pug'
app.get('/profile/:id', function (req, res) {
    var id = req.params.id;
    //console.log(id);
    res.render('profile', {data:id});
});
app.get('/profile_new', function (req, res) {
    var id = req.params.id;
    //console.log(id);
    res.render('profile',{data:logged_id});
});

// Create a route for 'journal.pug'
app.get('/journal', function (req, res) {
    res.render('journal');
});

// Create a route for testing the db
 app.get('/all-applications/:id',async function(req, res) {
    var id = req.params.id;
    //console.log("this function is called.");
    //console.log(id);
    logged_id=id;
    // Prepare an SQL query that will return all rows from the applications_table
    //var sql = 'select A_ID,Company_Name, Job_Title, Location, Status, DATE_FORMAT(SubmissionDate, "%D %b, %Y") SubmissionDate,DATE_FORMAT(LastUpdate, "%D %b, %Y") LastUpdate, Documents,Filename from Applications Where id = ?';
    var results = await new Applications().getUserApplications_new(id);
   
    res.render('all-applications', {data:results,logged_id:id});
 
});

//Create a route for specific application to display all the information displayed to that specific application
app.get('/application_details', function (req, res) {
    res.render('application_details');
}); 

// Route for 'register.pug'
app.get('/register', function (req, res) {
    res.render('register');
});

// Set password route
var user;
app.post('/set_password', async function (req, res) {
    params = req.body;
    user = new User(params.name,params.email);
    //console.log(params.email);
    try {
        id = await user.getIdFromEmail(params.email);
       // console.log(id);
        if (id) {
            // If a valid, existing user is found, set the password and redirect to the users profile page
            await user.setUserPassword(params.password);
            user.id=id;
            res.redirect('/profile/' + id);
        }
        else {
            // If no existing user is found, add a new one
            newId = await user.addUser(params.password);
            user.id=newId;
           // console.log(newId)
            res.redirect('/profile/' + newId);
        }
    } catch (err) {
        console.error(`Error while adding password `, err.message);
    }
});

// Route for 'login.pug'
app.get('/login', function (req, res) {
    res.render('login');
});

// Route for Logout
app.get('/logout', function (req, res) {
    //req.session = null //Deletes session cookie.
    //Deletes the session from the database.
    req.session.destroy(null); 
    res.redirect('/homepage');
  });

// Route for 'newentry.pug'
app.get('/newentry/:id', function (req, res) {
    logged_id=req.params.id;
    res.render('newentry',{logged_id:logged_id});
});

//Route to recieve new entry form posting
app.post('/newentry', async function (req, res) {
    params = req.body;
    var user_id= params.logged_id;
   // console.log(req.session.id);
    var fileName;
    var fileData;
    if (req.files!=null){
       // console.log(req.files.Documents);
        fileName=req.files.Documents.name;
        fileData=req.files.Documents.data;
        //console.log("File Data is: ");
        //console.log(fileData);
        //console.log(fileName);
    }
    else{
        fileName="";
        fileData="";
    }
    logged_id=user_id;
    var id=logged_id;
    //console.log(id);
    //console.log(params.LastUpdate);
    if(params.LastUpdate==''){
        params.LastUpdate=null;
    }
    var newapp = new Applications(id,params.Company_Name, params.Job_Title, params.Location, params.Status, params.SubmissionDate, params.LastUpdate,fileName);
    var result=await newapp.addApplication(fileData);
    //console.log("Applicaiton added successfully");
    //console.log(result);
    //alert("Application information added successfully.");
    res.redirect("/all-applications/"+ id);
});

//Route to recieve new entry form posting
app.post('/update', async function (req, res) {
    params = req.body;
    var user_id=params.logged_id;
    logged_id=user_id;
   // console.log(req.session.id);
    var fileName;
    var fileData;
    if (req.files!=null){
        //console.log(req.files.Documents);
        fileName=req.files.Documents.name;
        fileData=req.files.Documents.data;
        //console.log("File Data is: ");
        //console.log(fileData);
       // console.log(fileName);
    }
    else{
        fileName="";
        fileData="";
    }
    var id=logged_id;
    //console.log(id);
    //console.log(params.LastUpdate);
    if(params.LastUpdate==''){
        params.LastUpdate=null;
    }
    var newapp = new Applications(id,params.Company_Name, params.Job_Title, params.Location, params.Status, params.SubmissionDate, params.LastUpdate,fileName);
    var result=await newapp.updateApplication(fileData,params.A_ID);
   // console.log("Applicaiton added successfully");
    //console.log(result);
    //alert("Application information added successfully.");
    res.redirect("/all-applications/"+ user_id);
});

// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    params = req.body;
    var user = new User(params.email, params.password);
    //console.log("Authentication..") ;
    //console.log(params.email);
    try {
        id = await user.getIdFromEmail(params.email);
       // console.log(id);
        if (id) {
            match = await user.authenticate(params.password,params.email);
            //console.log(match);
            if (match) {
                // Set the session for the user
                //console.log(req.session);
                req.session.id = id;
                logged_id=id;
               // console.log(req.session.id);
               // console.log("Id Set ");
                req.session.loggedIn = true;
                //console.log(req.session);
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

// Creating a new user
// app.get("/all-applications/:id", async function(req, res) {
//     var id = req.params.id;
//     //Create a user profile with ID passed
//     var user = new User(id);
//     await user.getUserDetails();
//     await user.getUserImage();
//     await user.getUserApplications();
//     await user.getUserJournal();
//     resultApplications = await getApplications.getAllApplications();
//     res.render('user', {'User':user, 'Applications':resultApplications});
// });

// Allowing user to download the submitted documents.
app.get("/viewfile/:id", async function(req, res) {
    var id = req.params.id;
    //console.log(id);
    var sql = 'select Documents,Filename from Applications Where A_ID = ?';
    var document;
    var fileName;
    db.query(sql,[id]).then(results => {
        document=results[0].Documents;
        fileName= results[0].Filename;  
        //console.log(document);
        //console.log(fileName);
        var mimetype = mime.lookup(fileName);
       // console.log(mimetype);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        res.setHeader('Content-type',mimetype);
        res.write(document);
        res.end();
    });
    //saveData(document,fileName);
});

// Route for deleting an application
app.get("/delete/:id",  function(req, res) {
    var id = req.params.id;
    var aid= parseInt(id.split("&")[0]);
    var user_id= parseInt(id.split("&")[1]);
    //var user_id=req.body.logged_id;
    //console.log(aid);
    //console.log(user_id);
    var sql = 'delete from Applications Where A_ID = ?';
     db.query(sql,[aid]).then(results => {
        res.redirect("/all-applications/"+user_id);
    });
});

// Route for editing/updating an application
app.get("/edit/:id",  function(req, res) {
    var id = String(req.params.id);
    var aid= parseInt(id.split("&")[0]);
    var user_id= parseInt(id.split("&")[1]);
    //var user_id=req.body.logged_id;
    //.log(aid);
    //console.log(user_id);
    var sql = 'Select A_ID,Company_Name, Job_Title, Location, Status, DATE_FORMAT(SubmissionDate, "%Y-%m-%d") SubmissionDate,DATE_FORMAT(LastUpdate, "%Y-%m-%d") LastUpdate from Applications Where A_ID = ?';
    db.query(sql,[aid]).then(results => {
        res.render('newentry_update', {data:results[0],logged_id:user_id});
    });
});


//**********************************************************************************

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});