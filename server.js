"use strict";

// const config      = require('dotenv').config();        //uncomment

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
// const pg          = require('pg');                     //uncomment


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


// const pool = new Pool(config);
// pool.connect((err, db, done) => {                   //connecting to the database
//   if(err) {
//   return console.log(err);
// } else {
  //insert data into the database here? - replacing below


    //eventDB object structure
    const eventDB = {
    //   randomUrl: {
    //     pk: randomUrl,
    //     title: req.body.title,              //event name
    //     location: req.body.location,        //event location
    //     descipt: req.body.description,
    //     orgaznier: req.session.user_id,     //organizers_id
    //     question1: req.body.question1,
    //     question2: req.body.question2
    //   }
    }
    
    //options object structure to store two questions
    const options = {
    //  randomUrl: {
    //    quetion1: text,
    //    question2: text
    //  }
    }

    // responses object structure 
    const responseDB = {
    //  randomUrl: {
    //    name: req.body.name,                //response name
    //    response1: req.body.question1,      //response1
    //    response2: req.body.question2,      //response2
    //    respondent: req.session.user_id
    //  }
    }

  // Home page
  app.get("/", (req, res) => {
    res.render("index.ejs");
  });
  
  //access the create event page 1
  app.get("/events", (req, res) => {
    res.render("events.ejs");
  });

//  Receive form info for event creation and render events2.ejs
  app.post("/events", (req, res) => {
    const randomUrl = generateRandomString();
    const eventName = req.body.eventName;
    const eventLocation = req.body.eventLocation;
    const eventDescription = req.body.eventDescription;
    const organizerName = req.body.organizerName;
    const organizerEmail = req.body.organizerEmail;
    req.session.user_id = 1;   //should be assigned random nums
    //console.log(req.session.user_id);
    // eventDB[randomUrl] = {
    //   pk: randomUrl,
    //   title: req.body.title,                //event name
    //   email: req.body.email,
    //   location: req.body.location,          //event location
    //   descipt: req.body.description,        //event description
    //   organizer_id: req.session.user_id,    //organizers_id
    // }
    res.render("events2.ejs");
  });


  //   access the create event page 2, templateVars needs to be adjusted for correct variable
  app.post("/eventOptions", (req, res) => {
      const optionOne = req.body.optionOne;
      const optionTwo = req.body.optionTwo;
      const templateVars = {
          eventLink: req.body.optionTwo //I just randomly entered the req.body.optionTwo in order to test my form output and have something to render. 
      }; 
    res.render("events3.ejs", templateVars);
  });

//   This will be temporary and instead get rolled in to the following /events/:id with parameters for which cookie the person has. 
  app.get("/eventPageFinal", (req, res) => {
    // const optionOne: req.body.optionOne;
    // const optionTwo: req.body.optionTwo;
    const templateVars = {
        eventTitle: "Your event title!",
        eventDescription: "And a little description",
        eventLocation: "Vancouver",
        optionOne: "Monday",
        optionTwo: "Tuesday",
        optionOnesum: "3",
        optionTwosum: "5",
        attendeeOne: "Jim",
        attendeeOneresponseOne: "yes",
        attendeeOneresponseTwo: "no",
        attendeeTwo: "Karen",
        attendeeTworesponseOne: "yes",
        attendeeTworesponseTwo: "yes"
        // attendeeSum: "2";
    };

    res.render("eventPageFinal.ejs", templateVars);
  });

  app.post("/vote", (req, res) => {
    console.log("Check");
    console.log(typeof req.body.optionOne);
    console.log("Check again");
    console.log(req.body.optionTwo);
    const templateVars = {
        eventTitle: "Your event title!",
        eventDescription: "And a little description",
        eventLocation: "Vancouver",
        optionOne: "Monday",
        optionTwo: "Tuesday",
        optionOnesum: "3",
        optionTwosum: "5",
        attendeeOne: "Jim",
        attendeeOneresponseOne: "yes",
        attendeeOneresponseTwo: "no",
        attendeeTwo: "Karen",
        attendeeTworesponseOne: "yes",
        attendeeTworesponseTwo: "yes"
        // attendeeSum: "2";
    };
    res.render("eventPageFinal.ejs", templateVars);
  });


  //access a specific created/shareable url, all users are able to access this page once provided.
  app.get("/events/:id/", (req, res) => {
    //   There will be something like:
        // if (req.params.id = event_id) {
        // if (req.session.cookie = organizerCookie) {
    //     req.render("eventPageFinal.ejs", tempVars);
    // } else if (req.session.cookie = attendeeCookie) {
    //     req.render("eventPageAttendee.ejs", tempVars);
    // } else if (!req.session.cookie) {
    //     req.render("eventPageAttendee.ejs"); 

        // } else {
            // req.render("deleted.ejs"); 
        // }
 
    // }
    const id = req.params.id;
    //console.log(eventDB[id]);
      const tempVars = {
        randomUrl: id,
        title: eventDB[id].title,
        location: eventDB[id].location,
        descript: eventDB[id].description
      }
  });

    //organizer can delete the page
    app.post("/events/:id/delete", (req, res) => {
        //add verify user identity
        delete eventDB[req.params.id];
        res.redirect("/");
      })

//   //add the poll by the organizer/modify the page
//   app.post("/events/:id/edit", (req, res) => {
//     req.session.user_id = 1; //this will be updated later with the cookie function
//     const url = req.params.id;
//     //verify user identity
//     if (eventDB[url].organizer_id != 1) {
//       res.send("you'r not allowed!");
//     }
//     options[url] = {
//       time1: req.body.time,
//       time2: req.body.time2
//     }
//     res.render("show_user"); 
//   });



  //access the response page by the attendees to view all responses/checking on final decision
//   I think this is now handled by an earlier conditional app.get("/events/:id")
//   app.get("/events/:id/responses", (req, res) => {
//     const url = req.params.id;
//     const tempVars = {
//       url: url,
//       title: eventDB[url].title,
//       location: eventDB[url].location,
//       time1: options[url].time,
//       time2: options[url].time2
//     }
//     res.render("responses", tempVars);
//   });

  //post information to the response page by the attendees
  app.post("/responses/:id/edit", (req, res) => {
    const url = req.params.id;
    const tempVars = {
      url: url,
      title: eventDB[url].title,
      location: eventDB[url].location,
      time1: options[url].time,
      time2: options[url].time2,
    }

    responseDB[url] = {           //need to replace url with user's cookie so user can edit their own response
      name: req.body.name,
      response1: req.body.response,
      response2: req.body.response2,
      event_id: url
    }
    
    res.render("eventPageAttendee.ejs", tempVars);
  });

  //modify information to the response specific to an attendee
  app.post("/responses/:id/delete", (req, res) => {
    delete responseDB[TBD];   //TBD should be user's cookie/identifier
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

