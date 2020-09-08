// load environment variables
require('dotenv').config();

const express = require('express');
const http = require('http');
const debug = require('debug')('app');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const { port, mongoURI, sessionSecret } = require('./config');

// importing route handlers
const userRouter = require('./routes/user');
const empployeeRouter = require('./routes/employee');

// create an instance of express app
const app = express();

// configuring mongo session store
const sessionStore = new MongoDBStore({
  uri: mongoURI,
  collection: 'sessions',
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// setup session middleware
app.use(session({
  secret: sessionSecret,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 604800000 }
}));
app.use(morgan('tiny'));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// calling database service
require('./services/dbService')();

// loading routes
app.use(userRouter);
app.use('/admin', empployeeRouter);

const server = http.createServer(app);

server.listen(port, () => {
  debug(`Server listening on port ${port}`);
});
