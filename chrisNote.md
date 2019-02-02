work journal Jan 31
1. server.js file working - logging out the listening on port
2. console.log out the linkages to database (tbu later)
3. all user stories set up
4. 11 digits random num urls
5. nodemon working for now
6. setup cookies
7. the random url part has been stored to the database 



to do 
- how to extract data from front-end
- data as part of the render page
- set up pg for database


temporary changes
- index.js in node module/cookies-session (key param)
line 56
  if (!keys && opts.signed) throw new Error('.keys required.')
  comment out for now
- knexfile.js - the credential issues

comment out the app.js => url: "/api/users and replaced with url "/events

const eventInfo = {
      title: eventDB["pk"].title,
      question1: eventDB["pk"].question1,
      question2: eventDB["pk"].question2,
      respondents: responseDB["pk"].name, //this row will show if other responded
      responses1: responseDB["pk"].response1, //this row will show if other responded
      response2: responseDB["pk"].response2 //this row will show if other responded
    }

