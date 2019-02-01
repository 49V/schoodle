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
  const buffer = crypto.randomBytes(256);

  // Cut our buffer down to our desired length
  return buffer.toString('hex').slice(0, length);
}

module.exports = function makeDatabaseHelpers(db) {
  return {

    /*
     * Creates an event and associated organizer in the database 
     *
     * @param event: typeof Object : An object with properties (order does not matter) :
     *  1) description  : typeof String
     *  2) name         : typeof String
     *  3) location     : typeof String
     * @param organizer: typeof Object: An object with properties (order does not matter) :
     *  1) email    : typeof String
     *  2) name     : typeof String
     * 
     * @returns resolved promise if successful, otherwise unresolved promise
     */ 
    createEvent : function(event, organizer) {

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
      db('organizers').insert(newOrganizer).returning('id')
      .then((id) => {
        // Set the foreign key for the Events table
        newEvent.organizers_id = id[0];
        return db('events').insert(newEvent);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
}

const event = {
  description: "Reunited",
  location: "Toronto",
  name: "Chang G"
};

const organizer = {
  email: "moshelawlor@gmail.com",
  name: "Beans Lawlor"
};


