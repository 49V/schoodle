# Schoodle
Schoodle is a web application allowing users to arrange an event and have their chosen attendees vote on which date/time works for them. It is based on [Doodle.com](http://www.doodle.com) 

Schoodle was created as a midterm group project during the Lighthouse Labs web development bootcamp by [Moshe Lawlor](https://github.com/49V), [Erin Toth](https://github.com/erinltoth), and [Christina Hsu](https://github.com/ChristinaHsu88). 

## Dependencies 
 - Node 5.10.x or above
 - NPM 3.8.x or above
 - PostgreSQL 
    - a local database 
 

## Getting Started

1. Fork and clone the repo.
2. Run `psql` in your terminal and replace variables with your choice
    a. `CREATE ROLE <username> WITH LOGIN password: '<password>'; 
    b. `CREATE DATABASE <dbname> OWNER <username>;
3. Create the `.env` by using `.env.example` as a reference
4. Update the `.env` file with your correct local information
5. Install dependencies: `npm install`
6. Run migrations: `npm run knex migrate:latest`
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Description
- The organizer creates an event and chooses two date options. A cookie is created which allows them to access the event page and see the results after their chosen attendees have voted.
- The returned link is unique and privacy is ensured by the hashed long URL. This link can be shared (locally) with chosen attendees.
- When an attendee opens the link they can enter their name and e-mail address and chose which of the dates work for them
    - If they need to change one of their responses they can enter their name and e-mail again and update their vote. The page will reload and show their updated vote. 

## Screenshots

![Schoodle main page](https://github.com/49V/schoodle/blob/master/docs/main-page.png?raw=true_)

![Schoodle event creation](https://github.com/49V/schoodle/blob/master/docs/event-creation.png?raw=true)

![Schoodle date picking](https://github.com/49V/schoodle/blob/master/docs/date-picking.png?raw=true)

![Schoodle link delivery](https://github.com/49V/schoodle/blob/master/docs/link-delivery.png?raw=true)

![Schoodle voting page](https://github.com/49V/schoodle/blob/master/docs/voting.png?raw=true)

