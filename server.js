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
app.get("/events/:id", (req, res) => {

  const cookie = req.cookies.event_id;

  if (cookie === req.params.id) {
    dataHelpers.getEventPageData(cookie)
        .then((rows) => {
            const templateVars = { 
                eventTitle: rows[0].name,
                eventDescription: rows[0].description,
                eventLocation: rows[0].location,
                optionOne: rows[0].options_dates[0],
                optionTwo: rows[0].options_dates[1],
                attendees: rows, 
              }
            return res.render('eventPageFinal.ejs', templateVars);
        })

    
  } else {

    dataHelpers.getEventPageData(req.params.id)
    .then((rows) => {
        const templateVars = { 
            eventTitle: rows[0].name,
            eventDescription: rows[0].description,
            eventLocation: rows[0].location,
            optionOne: rows[0].options_dates[0],
            optionTwo: rows[0].options_dates[1],
            attendees: rows,
            eventLink: req.params.id  
          }
        return res.render('eventPageAttendee.ejs', templateVars);
    })

  }

});

app.post("/events/:id", (req, res) => {

   const attendeeVote1 = (req.body.attendeeVote1) ? req.body.attendeeVote1 : 0;
   const attendeeVote2 = (req.body.attendeeVote2) ? req.body.attendeeVote2 : 0;
   let response = {
       attendee_name: req.body.attendeeName,
       attendee_email: req.body.attendeeEmail,
       dates: [attendeeVote1, attendeeVote2],
       events_id: req.params.id
   }

   const cookie = req.cookies.attendeeCookie;

   if (cookie === response.attendee_email) {
       console.log("BLEEP");
       response.attendee_email = cookie;
       dataHelpers.updateResponse(response)
       .then((success) => {
            return res.redirect(`/events/${req.params.id}`);
       });

   } else {
    dataHelpers.createResponse(response)
    .then((success) => {
        res.cookie('attendeeCookie' , req.body.attendeeEmail, {encode: String});
        return res.redirect(`/events/${req.params.id}`);
    })
    }

});


// organizer deletes the page 
app.get("/events/:id/delete", (req, res) => {
  res.redirect("/");
})   


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);  
});
