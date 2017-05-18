const express = require('express')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0');

const port = 3000;

const app = express();
app.use(session({secret: 'CottonEyeJoe'}))
app.use(passport.initialize()); // MUST BE IN THIS ORDER INTIALIZE THEN SESSION
app.use(passport.session());

passport.use(new Auth0Strategy({
   domain:       'justicepwhite.auth0.com',
   clientID:     'Zm3dngmc7zKGLxo5rP7grjHub7iJ3GfT',
   clientSecret: 'i3EoU-YNT9byDw2BXwSShBbsMQWRK4P6EE0w93lo_2WZNcOCllOu19aS2f0CXKoB',
   callbackURL:  '/auth/callback'
 }, function(accessToken, refreshToken, extraParams, profile, done){
   //Normally I would find the user in the database here and then invoke done
   return done (null, profile);
 }));

 app.get('/auth', passport.authenticate('auth0')); //START

// AUTH0 RETURNS HERE
 app.get('/auth/callback', // this must match the callbackURL in above
    passport.authenticate('auth0', {
      successRedirect: '/coolKidsClub'
    , failureRedirect: '/login'})
    , function (req,res) {
      res.status(200).send(req.user)
    });

passport.serializeUser(function(user, done) { //encode
  return done(null, user);
});
passport.deserializeUser(function(obj, done) {//decode
  // What do we want to put on req.user ??
  // obj is the profile object full of user info
  return done(null, obj);
})

app.get('/me', function(req,res){
  res.send( req.user )
})

app.listen(port, console.log("Listening on", port))
