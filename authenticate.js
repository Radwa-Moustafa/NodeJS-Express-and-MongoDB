var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy; //Jwt => JSON web token
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.js');
var FacebookTokenStrategy = require('passport-facebook-token');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});// in seconds = (1hr)
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
  clientID: config.facebook.clientId,
  clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({facebookId: profile.id}, (err, user) => {
      if (err) {
          return done(err, false);
      }
      if (!err && user !== null) {
          return done(null, user);
      }
      else {
          user = new User({ username: profile.displayName });
          user.facebookId = profile.id;
          user.firstname = profile.name.givenName;
          user.lastname = profile.name.familyName;
          user.save((err, user) => {
              if (err)
                  return done(err, false);
              else
                  return done(null, user);
          })
      }
  });
}
));

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                console.log("IsAdmin",user.admin);
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));


    exports.verifyAdmin = function (req, res, next) {
      console.log('Inside VerifyAdmin Function');
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        var user = jwt.verify(token, config.secretKey);
        console.log("user", user);

        User.findOne({_id:  user._id}, (err, user) => {
          if (err) {
            return res.sendStatus(403);
          }else{
            console.log('UserName: ', user.username,'IsUserAdmin: ', user.admin)
            if(user.admin){
              next();
            }else
            return res.sendStatus(403);
          }
        });
      } else {
        res.sendStatus(401);
      }
    };

    exports.getUserId = function (req, res, next) {
          var token = req.headers.authorization.split(" ")[1];
          var user = jwt.verify(token, config.secretKey);
          console.log("user", user);
          return next(user._id);
      };


    exports.verifyUser = passport.authenticate("jwt", { session: false });
