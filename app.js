var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promotionRouter = require('./routes/promotionRouter');
var leaderRouter = require('./routes/leaderRouter');
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('connected correctly to server');
})

var app = express();
var basicAuth = require('express-basic-auth');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12346789-09876-54321'));

function auth(req, res, next) {
  console.log("inside auth function");
  console.log("Request Headers \n", req.headers);
  console.log("Cookies \n", req.signedCookies);

  if (!req.signedCookies.user) {
    console.log("!req.signedCookies.user");
    var authHeader = req.headers.authorization;
    console.log("authHeader \n", authHeader);
    if (!authHeader) {
      console.log("inside !authHeader");
      var err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authentication", "Basic");
      err.status = 401;
      return next(err);
    }
    var auth = new Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    var userName = auth[0];
    var userPassword = auth[1];

    if (userName == "admin" && userPassword == "password") {
      console.log("user password are correct \n", userName, userPassword);
      res.cookie("user", "admin", { signed: true });
      res.setHeader("WWW-Authentication", "Basic");
      next();
    } else {
      var err = new Error("You are not authenticated!");
      err.status = 401;
      return next(err);
    }
  } else {
    if (req.signedCookies.user == "admin") {
      //valid cookie with right credentials
      next();
    } else {
      var err = new Error("You are not authenticated!");
      err.status = 401;
      return next(err);
    }
  }
}

app.use(basicAuth({
  challenge: true,
  users: { 'admin': 'password' }
}));
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
