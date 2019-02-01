"use strict";

// const config      = require('dotenv').config(); 

const PORT        = process.env.PORT || 8080;

// const ENV         = process.env.ENV || "development"; 
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

// const knexConfig  = require("./knexfile");
// const knex        = require("knex")(knexConfig[ENV]); 
const morgan      = require('morgan');
// const knexLogger  = require('knex-logger');
// const pg          = require('pg');


// Seperated Routes for each Resource
// const usersRoutes   = require("./routes/users");
const cookieSession = require("cookie-session");
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
// app.use(knexLogger(knex)); 

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
// app.use("/events", usersRoutes(knex));  //need to confirm the api line

//use cookies
app.use(cookieSession({
  name: 'session',
  key: ['demo'],
  maxAge: 24 * 60 * 60 * 1000
}))


// const pool = new Pool(config);

// pool.connect((err, db, done) => { //connecting to the database
//   if(err) {
//   return console.log(err);
// } else {
  //insert data into the database here? - replacing below


    //tentative event database
    const eventDB = {
    //   randomUrl: {
    //     pk: randomUrl,
    //     title: req.body.title,         //event name
    //     location: req.body.location,   //event location
    //     descipt: req.body.description,
    //     orgaznier: req.session.user_id,     //organizers_id
    //     question1: req.body.question1,
    //     question2: req.body.question2
    //   }
    }
    const options = {

    }

    // //tentative responseDB
    const responseDB = {
    //   randomUrl: {
    //     name: req.body.name,            //response name
    //     response1: req.body.question1,  //response1
    //     response2: req.body.question2,   //response2
    //     respondent: req.session.user_id
    //   }
    }


  // Home page
  app.get("/", (req, res) => {
    res.render("event");
  });
  
  //access the create event page
  app.get("/events", (req, res) => {
    res.render("new");
  });

  //create a new event with event name and description by an organizer, store a cookie of the organizer
  app.post("/events", (req, res) => {
    const randomUrl = generateRandomString();
    req.session.user_id = 1;   //should be assigned random nums
    //console.log(req.session.user_id);
    eventDB[randomUrl] = {
      pk: randomUrl,
      title: req.body.title,         //event name
      email: req.body.email,
      location: req.body.location,   //event location
      descipt: req.body.description,  //event description
      organizer_id: req.session.user_id,     //organizers_id
    }
    res.redirect("/events/" + randomUrl + "/edit");
  });

  //access a specific created/shareable url, all users are able to access this page once provided.
  app.get("/events/:id/edit", (req, res) => {
    const id = req.params.id;
    //console.log(eventDB[id]);
    const tempVars = {
      randomUrl: id,
      title: eventDB[id].title,
      location: eventDB[id].location,
      descript: eventDB[id].description
    }
     res.render("show", tempVars);
  });

  //close/add the poll by the organizer
  app.post("/events/:id/edit", (req, res) => {
    //req.session.user_id = 1; //this will be updated later with the cookie function
    const user = req.params.id;
    options[user] = {
      time1: req.body.time,
      time2: req.body.time2
    }
    console.log(options);
    res.render("show_user"); 
  });


  //modify the poll page by the organizer
  app.patch("/events/:id", (req, res) => {
    if (req.session.user_id == eventDB[randomUrl].user) {
        eventDB[randomUrl] = {
        title: req.body.title,         //event name
        location: req.body.location,   //event location
        descipt: req.body.description,  //event description
        question1: req.body.question1,
        question2: req.body.question2
      }
      res.redirect("/events/" + randomUrl);
      }
      res.redirect("responsePageHere"); //if not the organizer cookie, redirect to respondent's page
    })
    

  //delete the poll page by the organizer
  app.delete("/events/:id", (req, res) => {
    res.send("this page has been deleted by the orgaznier");
  });

  //access the response page by the attendees to view all responses/checking on final decision
  app.get("/events/:id/responses", (req, res) => {
    res.render("responsePageHere");
  });

  //post information to the response page by the attendees
  app.post("/events/:id/responses", (req, res) => {
    responseDB[randomUrl] = {
      name: req.body.name,
      response1: req.body.response1,
      response2: req.body.response2,
      respondent: req.session.user_id 
    }
    res.redirect("responsePageHere");
  });

  //modify information to the response specific to an attendee
  app.patch("/events/:id/responses/:id", (req, res) => {
    const respondent = req.session.user_id;
    if(responseDB[randomUrl].respondent == respondent) {
      const responseInfo = {
        name: req.body.name,
        response1: req.body.response1,
        response2: req.body.respons2
      }
      res.render("responsePageHere", responseInfo);
    }
  });

  //generate random strings(11 digits) for URLs
  function generateRandomString() {
    return Math.random().toString(36).substring(2);
  }

  generateRandomString()

  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });

//   } 
// });

