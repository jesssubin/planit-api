const PORT = process.env.PORT || 3005;
const ENV = require("./environment");

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const logger = require('morgan');
const bcrypt = require('bcrypt');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const req = require('request');
const request = require('request-promise-native');

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

app.use(cookieSession({
  name: 'session',
  keys: ['apqr16-7acujhu-fj8ahfgk-jfujjka8', 'zxiuslojf-nsijwi98-dna1-2djkkand'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


app.use(cors()); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter(db));
app.use('/login', loginRouter);
app.get('/search', (req, res) => {
  const query="Toronto"; 
  const API_KEY=process.env.API_KEY; 
  const searchURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`
  request.get(searchURL, (err, res, body) => {
    console.log(body);
  }); 
})

module.exports = app;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in ${ENV} mode.`);
});