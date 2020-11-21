const PORT = process.env.PORT || 3001;
const ENV = require("./environment");

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');



const { Client } = require('pg')
const db = new Client()
db.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})



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

