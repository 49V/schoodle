"use strict";

require('dotenv').config();                            

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
var cookieParser = require('cookie-parser');
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");             
const knex        = require("knex")(knexConfig[ENV]);  
const moment = require('moment');
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');            

// Separated Routes for each Resource
const usersRoutes = require("./routes/users");

// The `dataHelpers` module provides an interface to the database of schoodle
const dataHelpers = require("./lib/db")(knex);

// Seperated Routes for each Resource
const cookieSession = require("cookie-session");
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

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
// app.use(cookieSession({
//   name: 'session',
//   keys: [],
//   maxAge: 24 * 60 * 60 * 1000
// }))

app.use(cookieParser());

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

  const event = {
    name: req.body.eventName, 
    location: req.body.eventLocation,
    description: req.body.eventDescription
  };

  const organizer = {
    email: req.body.organizerEmail,
    name: req.body.organizerName
  };

  dataHelpers.createOrganizerThenEvent(event, organizer)
  .then((eventID) => {
    if(eventID) {
      res.cookie('event_id' , eventID[0]);
      res.render("events2.ejs");
    } else {
      console.log("ERROR");
    }
  });
});

// add event time options
app.post("/eventOptions", (req, res) => {
  const options = {
    dates: [req.body.optionOne, req.body.optionTwo],
    events_id: req.cookies.event_id
  };
  
  dataHelpers.createOption(options)
  .then((success) => {
    if (success) {
      const templateVars = {            
        eventLink: req.cookies.event_id
      };
      res.render("events3.ejs", templateVars);
    } else {
      console.log("ERROR");
    }
  });
});

//   This will be temporary and instead get rolled in to the following /events/:id with parameters for which cookie the person has. 
//   final results
app.get("/eventPageFinal", (req, res) => {

  // If no cookie
  // res.render('eventPageAttendees.ejs')
  // Else if cookie === eventID
  // res.render(eventPageFinal.ejs)
  // Else if cookie !== eventID
  // res.render(eventPageAttendees.ejs)
  const cookie = req.cookies.event_id;
console.log(cookie);
  if (cookie) {
 
    dataHelpers.getEventPageData(cookie)
        .then((rows) => {
            const templateVars = { 
                eventTitle: rows[0].name,
                eventDescription: rows[0].description,
                eventLocation: rows[0].location,
                optionOne: rows[0].options_dates[0],
                optionTwo: rows[0].options_dates[1],
                attendees: rows, //rows[0].attendee_name, rows[0].responses_dates[0],[1]  
              }
            return res.render('eventPageFinal.ejs', templateVars);
            console.log(rows);
        })

    
  } else {
    // const templateVars = {

    // };
    res.render('eventPageAttendees.ejs', templateVars);
  }

//   const templateVars = { 
//     eventTitle: eventDB[1].eventTitle,
//     eventDescription: eventDB[1].eventDescription,
//     eventLocation: eventDB[1].eventLocation,
//     optionOne: options[1].optionOne,
//     optionTwo: options[1].optionTwo,
//     attendeesName: "Jim",  
//     attendeeOneresponseOne: "yes",
//     attendeeOneresponseTwo: "no",
//     attendeeTwo: "Karen",
//     attendeeTworesponseOne: "yes",
//     attendeeTworesponseTwo: "yes",
//     optionOnesum: "3",
//     optionTwosum: "5"
//     // attendeeSum: "2";
//   };
//   console.log(templateVars);
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
  console.log(tempVars);
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
    console.log(templateVars);
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
