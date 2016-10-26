var FacebookStrategy = require('passport-facebook').Strategy;
var Student = require('../models/Student');
import config from '../config/default';

const fbConfig = config.fb;

module.exports = function(passport) {

  passport.use('facebook', new FacebookStrategy({
    clientID        : fbConfig.appID,
    clientSecret    : fbConfig.appSecret,
    callbackURL     : fbConfig.callbackURL,
    passReqToCallback: true,
  },

  // facebook will send back the tokens and profile
  function(req, access_token, refresh_token, profile, done) {
		// asynchronous
		process.nextTick(function() {

			// find the user in the database based on their facebook id
	    Student.findOne({ 'fb.id' : profile.id }, function(err, student) {

      	// if there is an error, stop everything and return that
      	// ie an error connecting to the database
        if (err)
          return done(err);

        console.log('REQ IS');
        console.log(req);
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.log('profile IS');
        console.log(profile);
		    // if the user is found, then log them in
        if (student) {
          return done(null, student); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newStudent = new Student();

			    // set all of the facebook information in our user model
          newStudent.fb.id    = profile.id; // set the users facebook id
          newStudent.fb.access_token = access_token; // we will save the token that facebook provides to the user
          newStudent.fb.firstName  = profile.name.givenName;
          newStudent.fb.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned


          if (profile.emails)
            newStudent.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

			    // save our user to the database
          newStudent.save(function(err) {
            if (err)
              throw err;

            // if successful, return the new user
            return done(null, newStudent);
          });
        }
      });
    });
  }));
};