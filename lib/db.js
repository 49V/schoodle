// This file is used for accessing items in our database
const crypto = require('crypto');
const URI_LENGTH = 24;

/*
 * Generates a random, crpytographically secure URI of specified length
 * 
 * @param length: typeof Number: Indicates the number of characters to generate hashed URI
 * 
 * @returns hashedURI : typeof String : hashedURI of desired length
 */
function generateHashedURI (length) {
  // Generate a cryptographically secure random ID using built in library
  const buffer = crypto.randomBytes(256);

  // Cut our buffer down to our desired length
  return buffer.toString('hex').slice(0, length);
}

module.exports = function makeDatabaseHelpers(db) {
  return {

    /*
     * Creates an organizer and an associated event in the database 
     *
     * @param event: typeof Object : An object with properties (order does not matter) :
     *  1) description  : typeof String
     *  2) name         : typeof String
     *  3) location     : typeof String
     * @param organizer: typeof Object: An object with properties (order does not matter) :
     *  1) email    : typeof String
     *  2) name     : typeof String
     * 
     * @returns a Promise with a parameter that IF successful: equals true, ELSE: equals false
     */ 
    createOrganizerThenEvent : function(event, organizer) {
      event.hashed_url = generateHashedURI(URI_LENGTH);

      const newOrganizer = {
        email,
        name } = organizer;

      let newEvent = {
        description,
        hashed_url,
        location,
        name,
      } = event;
      
      // Create organizer then the event
      return db('organizers').insert(newOrganizer).returning('id')
      .then((id) => {
        // Set the foreign key for the Events table
        newEvent.organizers_id = id[0];
        return db('events').insert(newEvent);
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    },

    /*
     * Creates an options row for a given event 
     *
     * @param options: typeof Object : An object with properties (order does not matter) :
     *  1) ...dates     : typeof String   : Contain the dates (minimum 2) as separate property of object
     *    for a given event
     *  2) events_id    : typeof Integer  : The ID of the event in the Events table 
     * 
     * @returns a Promise with a parameter that IF successful: equals true, ELSE: equals false
     */ 
    createOption : function (options) {
      return db('options')
      .insert(options)
      .then((success) => {
        if(success) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    },

    /*
     * Given an eventID, IF a given event exists, and it has options returns a Promise with an input that 
     * contains an array of the unordered dates for all the options.
     * ELSE returns a Promise with an input that is false
     *
     * @param eventID: typeof String : A string with the unique event ID
     * 
     * IF EVENT EXISTS:
     * @return promise: typeof Promise: A promise that takes an array of unordered dates as its input (includes empty):
     *  Example.
     *    ["2018 01 02 12:00", "2018 01 01 12:00"]
     *  TODO:
     * ELSE: 
     * @return promise: typeof Promise: A promise that takes an the 'false' Boolean as its input:
     * Example usage: 
      dataHelpers.getAllOptions(test_events_id) 
      .then((result) => {
        if (result) {
          console.log("True", result);
        } else {
          console.log("False: ", result);
        }
      });
     */ 
    getAllOptions : function(eventID) {
      return db('options')
      .select('dates')
      .where({events_id: eventID})
      .limit(1)
      .then((rows) => {
        const dates = rows[0].dates;
        if(dates.length !== 0) {
          return dates;
        } else {
          return false;
        }
        
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    },

    /*
     * Given an eventID, 
     * IF a given event exists, returns all the promise with an Event object that must be resolved!
     * ELSE will return false
     *
     * @param eventID: typeof String : A string with the unique event ID
     * 
     * IF EVENT EXISTS:
     * @return promise: typeof Object: A promise that takes an event object as it's input:
     *  1) hashed_url     : typeof String : ID of event 
     *  2) name           : typeof String : The name of the event
     *  3) description    : typeof String : Event description (activities, costs, etc.)
     *  4) location       : typeof String : Where the event takes place
     *  5) organizers_id  : typeof String : The ID of the organizer in the Organizers table
     * ELSE: 
     * @return promise: typeof Object: A promise that takes a false boolean as it's input:
     *

     */ 
    getEvent : function(eventID) {
      return db('events')
      .select('*')
      .where({hashed_url: eventID})
      .limit(1)
      .then((rows) => {
        const event = rows[0];
        if(event) {
          return event;
        } else {
          return false;
        }        
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    },

    /*
     * Assumes that controller code has verified organizer, and then deletes an event of a given ID.
     *
     * @param eventID: typeof String : A string with the unique event ID
     * 
     * @returns a Promise with a parameter that IF successful: equals true, ELSE: equals false
     * 
     * Example Usage in "server.js" 
      const test = dataHelpers.deleteEvent("c210de758b1a7c03306f20d5q");
      test.then((result) => {
        if(result) {
          console.log("true");
        } else {
          console.log("false");
        }
      });
     */ 
    deleteEvent : function(eventID) {
      return db('events')
      .where({hashed_url: eventID})
      .limit(1)
      .del()
      .then((success) => {
        if(success) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    },

    /*
     * Creates an organizer and an associated event in the database. 
     *
     * @param response: typeof Object : An object with properties (order does not matter) :
     *  1) attendee_name  : typeof String
     *  2) attendee_email : typeof String
     *  3) ...dates       : typeof Boolean : Contains the true or false (minimum 2) as separate
     *    property of object to indicate whether or not the selected date works for a given event.
     *  4) events_id      : typeof integer
     * 
     * @returns a Promise with a parameter that IF successful: equals true, ELSE: equals false
     */
    createResponse : function(response) {
      return db('responses')
      .insert(response)
      .then((success) => {
        if (success.command) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    },

    /*
     * Given an eventID, IF a given event exists, returns a Promise with an input that contains
     * an array of the object of all the responses.
     * ELSE returns a Promise with an input that is false
     *
     * @param eventID: typeof String : A string with the unique event ID
     * 
     * IF EVENT EXISTS:
     * @return promise: typeof Object: A promise that takes an array of Results objects as its input (includes empty):
     *  TODO:
     * ELSE: 
     * @return promise: typeof Object: A promise that takes a false boolean as its input:
     *
       dataHelpers.getAllResponses("d54bea823ad78d1f9ef8667c")
      .then((result) => {
          if(result) {
            result.forEach((response) => {
              console.log(response);
            });
          } else {
            console.log("false");
            console.log(result);
          }
      });
     */ 
    getAllResponses : function(eventID) {
      return db('responses')
      .select('*')
      .where({events_id: eventID})
      .then((rows) => {
        if (rows.length !== 0) {
          return rows;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    },

    /*
     * Assumes that controller code has verified attendee, and then deletes response of a given ID.
     *
     * @param responseID: typeof String : A string with the unique response ID
     * 
     * @returns a Promise with a parameter that IF successful: equals true, ELSE: equals error or false
     * 
     */ 
    deleteResponse : function(responseID) {
      return db('responses')
      .where({id: responseID})
      .limit(1)
      .del()
      .then((success) => {
        if(success) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    },

    /*
     * Assumes that controller code has verified attendee, and updates a given responseID.
     *
     * @param updatedResponse: typeof Object : An object with properties (order does not matter) :
     *  1) attendee_name  : typeof String
     *  2) attendee_email : typeof String
     *  3) dates          : typeof String
     *  4) id             : typeof Integer
     * @returns a Promise with a parameter that IF successful: equals true, ELSE: equals error or false
     * 
     */ 
    updateResponse : function (updatedResponse) {
      return db('responses')
      .where({id: updatedResponse.id})
      .update(updatedResponse)
      .then((success) => {
        if(success) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    }

  }
}