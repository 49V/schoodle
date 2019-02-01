"use strict";

// require('dotenv').config(); //need to uncomment

const PORT        = process.env.PORT || 8080;
// const ENV         = process.env.ENV || "development"; //need to uncomment
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
// const knex        = require("knex")(knexConfig[ENV]); //need to uncomment
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const cookieSession = require("cookie-session")

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
// app.use(knexLogger(knex)); //need to uncomment

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
// app.use("/api/users", usersRoutes(knex)); //need to uncomment

//use cookies
app.use(cookieSession({
  name: 'session',
  key: ['demo'],
  maxAge: 24 * 60 * 60 * 1000
}))

//tentative event database
const eventDB = {
  randomUrl: {
    pk: randomUrl,
    title: req.body.title,         //event name
    location: req.body.location,   //event location
    descipt: req.body.description,
    user: req.session.user_id,     //organizers_id
    question1: req.body.question1,
    question2: req.body.question2
  }
}

//tentative responseDB
const responseDB = {
  randomUrl: {
    name: req.body.name,            //response name
    response1: req.body.question1,  //response1
    response2: req.body.question2,   //response2
    respondent: req.session.user_id
  }
}

// Home page
app.get("/", (req, res) => {
  res.render("MainPage");
});

//create a new event with event name and description by an organizer, store a cookie of the organizer
app.post("/events", (req, res) => {
  const randomUrl = generateRandomString();
  eventDB[randomUrl] = {
    pk: randomUrl,
    title: req.body.title,         //event name
    location: req.body.location,   //event location
    descipt: req.body.description,  //event description
    user: req.session.user_id,     //organizers_id
    question1: req.body.question1,
    question2: req.body.question2
  }
  res.redirect("/events/" + randomUrl);
});

//access a specific created/shareable url, all users are able to access this page once provided.
app.get("/events/:id", (req, res) => {
  const eventInfo = {
    title: eventDB[randomUrl].title,
    question1: req.body.question1,
    question2: req.body.question2,
    respondents: responseDB[randomUrl].name, //this row will show if other responded
    responses1: responseDB[randomUrl].response1, //this row will show if other responded
    response2: responseDB[randomUrl].response2 //this row will show if other responded
  }
  res.render("responsePageHere", eventInfo);
});

//close the poll by the organizer
app.post("/events/:id", (req, res) => {
  const eventFinal = {
    title: eventDB[randomUrl].title,
    location: eventDB[randomUrl].location,
    description: eventDB[randomUrl].description,
    question1: eventDB[randomUrl].question1,
    question2: eventDB[randomUrl].question2,
    response1: responseDB[randomUrl].respons21,
    response2: responseDB[randomUrl].response2 
  }
  res.render("finalevent", eventFinal); 
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


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});


