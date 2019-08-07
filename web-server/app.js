const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const httpErrors = require('http-errors');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const newsRouter = require('./routes/news');

const config = require('./config/config.json');
require('./models/main.js').connect(config.mongoDbUri);
const authCheckerMiddleware = require('./auth/auth_checker');

const app = express();

// load passport strategies
app.use(passport.initialize());
passport.use('local-signup', require('./auth/signup_passport'));
passport.use('local-login', require('./auth/login_passport'));

// view engine setup
app.set('views', path.join(__dirname, '../client/build'));
app.set('view engine', 'jade');
app.use('/static', express.static(path.join(__dirname, '../client/build/static/')));

app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/news', newsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpErrors(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;

