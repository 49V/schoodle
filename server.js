"use strict";

// require('dotenv').config();                            //uncomment

const PORT        = process.env.PORT || 8080;

// const ENV         = process.env.ENV || "development";  //uncomment
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

// const knexConfig  = require("./knexfile");             //uncomment 
// const knex        = require("knex")(knexConfig[ENV]);  //uncomment
const moment = require('moment');
const morgan      = require('morgan');
// const knexLogger  = require('knex-logger');            //uncomment


// Seperated Routes for each Resource
// const usersRoutes   = require("./routes/users");       //uncomment
const cookieSession = require("cookie-session");
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
// app.use(knexLogger(knex));                             //uncomment

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/styles", sass({
//   src: __dirname + "/styles",
//   dest: __dirname + "/public/styles",
//   debug: true,
//   outputStyle: 'expanded'
// }));
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.static("node_modules"));
// Mount all resource routes
// app.use("/events", usersRoutes(knex));                 //uncomment

//use cookies
app.use(cookieSession({
  name: 'session',
  key: ['demo'],
  maxAge: 24 * 60 * 60 * 1000
}))

// //eventDB object structure
const eventDB = {

}

// //options object structure to store two questions
const options = {
// //  randomUrl: {
// //    quetion1: text,
// //    question2: text
}

// Home page
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// new event page
app.get("/events", (req, res) => {
  res.render("events.ejs");
});

// create a new event 
// **need to set up cookies
app.post("/eventInfo", (req, res) => { 
  const randomUrl = generateRandomString();
  const {eventName, eventLocation, eventDescription, organizerName, organizerEmail} = req.body;
  eventDB[1] = {eventName, eventLocation, eventDescription, organizerName, organizerEmail, randomUrl};
  res.render("events2.ejs");
});


// add event time options
app.post("/eventOptions", (req, res) => {
  const {optionOne, optionTwo} = req.body;
  options[1] = {optionOne, optionTwo}; 
  const templateVars = {            
    eventLink: eventDB[1].randomUrl,
    attendeesName: "abc"
  }
  console.log(optionOnet);
  res.render("events3.ejs", templateVars);
});

//   This will be temporary and instead get rolled in to the following /events/:id with parameters for which cookie the person has. 
//   final results
app.get("/eventPageFinal", (req, res) => {
  const templateVars = { 
    eventTitle: eventDB[1].eventTitle,
    eventDescription: eventDB[1].eventDescription,
    eventLocation: eventDB[1].eventLocation,
    optionOne: options[1].optionOne,
    optionTwo: options[1].optionTwo,
    attendeesName: "Jim",  
    attendeeOneresponseOne: "yes",
    attendeeOneresponseTwo: "no",
    attendeeTwo: "Karen",
    attendeeTworesponseOne: "yes",
    attendeeTworesponseTwo: "yes",
    optionOnesum: "3",
    optionTwosum: "5"
    // attendeeSum: "2";
  };
  res.render("eventPageFinal.ejs", templateVars);
});

// 


// access a specific created/shareable url based on cookies info
app.get("/events/:id/", (req, res) => {
// Identify whether the user is the organizer/ or the attendees based on cookies
// if (req.params.id = event_id) {
//    if (req.session.cookie = organizerCookie) {
//     adding instance of what they can see as an organizer
//    } else if (req.session.cookie = attendeeCookie) {
//     adding instance of wha attendee can see as an attendee
//    } 
// } else {
    // req.render("deleted.ejs"); 
// }
  
  const tempVars = {
    randomUrl: eventDB[1].randomUrl,
    eventTitle: eventDB[1].eventTitle,
    eventLocation: eventDB[1].eventLocation,
    eventDescription: eventDB[1].eventDescription,
    optionOne: options[1].optionOne,
    optionTwo: options[1].optionTwo,
    attendeeSum: 5, //tentative number,
    optionOnesum: 2, //tent num
    optionTwosum: 4,
    attendeeOne: "Jim",
    attendeeOneresponseOne: "yes",
    attendeeOneresponseTwo: "no",
    attendeeTwo: "Karen",
    attendeeTworesponseOne: "yes",
    attendeeTworesponseTwo: "yes"
  }
  res.render('eventPageAttendee', tempVars) 
});

app.post("/events/:id", (req, res) => { //changed from vote as it's associated with the link organizer received
  const attendeesName = req.body.attendeesName;  
  const templateVars = {
    eventTitle: eventDB[1].eventTitle,
    eventDescription: eventDB[1].eventDescription,
    eventLocation: eventDB[1].eventLocation,
    randomUrl: eventDB[1].randomUrl,
    optionOne: options[1].optionOne,
    optionTwo: options[1].optionTwo,
    optionOnesum: "3",  
    optionTwosum: "5",
    attendeesName: attendeesName,//"Jim",
    //attendeeOneresponseOne: attendeesDB[1].attendeeResponseOne,//"yes",
    //attendeeOneresponseTwo: attendeesDB[1].attendeeResponseTwo //"no",
    // attendeeSum: "2";
    };
  res.render("eventPageFinal.ejs", templateVars);
  });


// organizer deletes the page 
app.get("/events/:id/delete", (req, res) => {
  res.redirect("/");
})   

//generate random strings(11 digits) for URLs
function generateRandomString() {
  return Math.random().toString(36).substring(2);
}



generateRandomString()

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

