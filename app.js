const PORT = process.env.PORT || 3001;
const ENV = require("./environment");

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');

// PG database client/connection setup
// const { Pool } = require('pg');
// const dbParams = require('./lib/db.js');
// const db = new Pool(dbParams);
// //const db = require("./db");
// console.log("Trying to connect to db");
// db.connect();
// console.log("db connect done ");
// const pg = require("pg");
// const client = new pg.Client(dbParams);
// const client = new pg.Client({
//   user: 'dbuser',
//   host: 'database.server.com',
//   database: 'mydb',
//   password: 'secretpassword',
//   port: 3211,
// })
// client.connect()
//       .catch(e => console.log('Error occured'))

const { Client } = require('pg')
const db = new Client()
db.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})
// console.log(client.connect); 
// client.connect()
//       .then(console.log("client connected"))
//       .catch(e => console.log(`Error connecting to Postgres server:\n${e}`));

// module.exports = client;


const cors = require("cors"); 
const databaseHelpers = require("./helpers/database_helper"); 

const app = express();
console.log("app connected");


app.use(cors()); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter(db));
app.use('/login', loginRouter);


module.exports = app;

// server.listen(PORT, () => {
//   console.log(`Listening on port ${PORT} in ${ENV} mode.`);
// });