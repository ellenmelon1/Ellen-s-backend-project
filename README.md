# Welcome to Northcoders News!

The project is a full stack application inspired by Reddit. It is built upon a RESTful API serving information from the Northcoders News Database. Information pertains to users, articles, comments and topics. The API was built using Postgres SQL and node-postgres.

Link to the live API: https://ellen-nc-news.herokuapp.com/api
Link to the backend repo: https://github.com/ellenmelon1/Ellen-s-backend-project

Link to the live frontend: https://ellenmelon.netlify.app
Link to the frontend repo: https://github.com/ellenmelon1/nc-news

# Requirements

- The minimum required version of Node to run this app locally is: v16.13.2
- Postgres v8.7.3 or higher
- dotenv v16 or higher
- NPM v8.1.2 or higher
- pg-format v1.0.4 or higher

To run the test suite, you will need Jest v27.5.1 or above, Supertest v6.2.2, Jest-extendedv 2.0.0, and Jest-sorted v1.0.14.

# Setup

1. Create two .env files in the route directory. Name them .env.test and .env.development. Set the PGDATABASE in each to connect to the desired database.
2. Create the database by running "npm run setup-dbs" from the terminal. Then run "npm run seed" to seed the database.
3. Clone the repository through the command line with git clone https://github.com/ellenmelon1/Ellen-s-backend-project.git
4. Install dependencies through the command line by running "npm install".
5. To install dev-dependencies to run the test suite, install Jest, Supertest, Jest-sorted and Jest-extended using the following commands: "npm i -D jest", "npm i -D supertest", "npm i --save-dev jest-sorted", "npm i --save-dev jest-extended".

To run the test suite, use "npm t endpoints.test.js".

# Available Endpoints

GET /api
GET /api/topics
GET /api/comments
GET /api/articles
GET /api/articles/:article_id
GET /api/articles/:article_id/comments
GET /api/users
GET /api/users/:username
PATCH /api/comments/:comment_id
PATCH /api/articles/:article_id
POST /api/articles
POST /api/topics
POST /api/articles/:article_id/comments
DELETE /api/comments/:comment_id
DELETE /api/articles/:article_id
