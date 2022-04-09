# Welcome to Northcoders News!

The project is a full stack application inspired by Reddit. The REST API uses node-postgres to interact with a PSQL database, and serves information about users, articles, comments and topics. TDD was implemented throughout its construction using Jest and Supertest.

Link to the live API: https://ellen-nc-news.herokuapp.com/api
Link to the backend repo: https://github.com/ellenmelon1/Ellen-s-backend-project

Link to the live frontend: https://ellen-nc-news.netlify.app/
Link to the frontend repo: https://github.com/ellenmelon1/nc-news

# Requirements

- Node v16.13.2 or higher
- Postgres v8.7.3 or higher

# Setup

1. Create two .env files in the route directory. Name them .env.test and .env.development. Set the PGDATABASE in each to connect to the desired database.
2. Create the database by running "npm run setup-dbs" from the terminal. Then run "npm run seed" to seed the database.
3. Clone the repository through the command line with git clone https://github.com/ellenmelon1/Ellen-s-backend-project.git
4. Install dependencies through the command line by running "npm install".
5. To install dev-dependencies to run the test suite, install Jest, Supertest, Jest-sorted and Jest-extended using the following commands: "npm i -D jest", "npm i -D supertest", "npm i --save-dev jest-sorted", "npm i --save-dev jest-extended".

To run the test suite, use "npm t endpoints.test.js".

# Available Endpoints

- GET /api
- GET /api/articles
- GET /api/articles/:article_id
- GET /api/articles/:article_id/comments
- GET /api/comments/:comment_id
- GET /api/users
- PATCH /api/articles/:article_id
- PATCH /api/comments/:comment_id
- POST /api/articles/:article_id/comments
- DELETE /api/comments/:comment_id
