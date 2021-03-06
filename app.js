var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promotionRouter = require('./routes/promotionRouter');
var leaderRouter = require('./routes/leaderRouter');
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
var config = require('./config');
const url = config.mongoUrl;
const connect = mongoose.connect(url);
var passport = require('passport');
var authenticate = require('./authenticate');

connect.then((db) => {
  console.log("connected correctly to server");
});

var app = express();
var basicAuth = require("express-basic-auth");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12346789-09876-54321'));
// app.use(session({
//   name:'session-id',
//   secret: '12346789-09876-54321',
//   saveUninitialized: false,
//   resave:false,
//   store: new fileStore()
// }))
//when you log in here,  
//a call to the passport authenticate local, 
//when this is done at the login stage, 
//the passport authenticate local will automatically 
//add the user property to the request message. 
//So, it'll add req.user and then, 
//the passport session that we have done here 
//will automatically serialize that user information 
//and then store it in the session. 
//So whenever a incoming request comes in
//from the client side with the session cookie already in place, 
//this will automatically load the req.user onto the incoming request. 
//So, that is how the passport session itself is organized
app.use(passport.initialize());
// app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);


// function auth(req, res, next) {
//   console.log(req.session);
//   if (!req.user) {
//     // if(!req.session.user) {
//     var err = new Error("You are not authenticated!");
//     err.status = 403; //forbidden
//     return next(err);
//   } else {
//     next();
//     // if (req.session.user === 'authenticated') {
//     //   next();
//     // }
//     // else {
//     //   var err = new Error('You are not authenticated!');
//     //   err.status = 403; //forbidden
//     //   return next(err);
//     // }
//   }
// }


// function auth(req, res, next) {
//   console.log("************inside auth function************");
//   console.log('req.session',req.session);
//   // console.log("Request Headers \n", req.headers);
//   // console.log("Signed Cookies \n", req.signedCookies);

//   //  if (!req.signedCookies.user) {
//     if(!req.session.user){
//     var authHeader = req.headers.authorization;
//     console.log("authHeader \n", authHeader);
//     if (!authHeader) {
//       console.log("inside !authHeader");
//       var err = new Error("You are not authenticated!");
//       res.setHeader("WWW-Authentication", "Basic");
//       err.status = 401;
//       return next(err);
//     }
//     var auth = new Buffer.from(authHeader.split(" ")[1], "base64")
//       .toString()
//       .split(":");
//     var userName = auth[0];
//     var userPassword = auth[1];

//     if (userName == "admin" && userPassword == "password") {
//       console.log("user password are correct \n", userName, userPassword);
//       // res.cookie("user", "admin", { signed: true });
//       req.session.user = "admin";
//       console.log("After Set Signed Cookie \n", req.signedCookies);

//       next(); // authorized
//     } else {
//       var err = new Error("You are not authenticated!");
//       res.setHeader("WWW-Authenticate", "Basic");
//       err.status = 401;
//       next(err);
//     }
//   } else {
//     // if (req.signedCookies.user === "admin") { //server checking sent cookie with the request
//       if (req.session.user === "admin") { //server checking sent cookie with the request
//       next();
//     } else {
//       var err = new Error("You are not authenticated!");
//       err.status = 401;
//       next(err);
//     }
//   }
// }

// app.use(auth);

// app.use(basicAuth({
//   challenge: true,
//   users: { 'admin': 'password' }
// }));

app.use(express.static(path.join(__dirname, 'public')));
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
