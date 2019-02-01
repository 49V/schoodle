// This file is used for accessing items in our database
const crypto = require('crypto');


/*
 * Generates a random, crpytographically secure URI of specified length
 * 
 * @ param length: typeof Number: Indicates the number of characters to generate hashed URI
 * 
 * @ returns hashedURI : typeof String : hashedURI of desired length
 */
function generateHashedURI (length) {
  const buffer = crypto.randomBytes(256);

  // Cut our buffer down to our desired length
  return buffer.toString('hex').slice(0, length);
}
