'use strict';

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('Not authorized.');
  } else {
    next();
  }
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}

module.exports = function (app, passport) {
  app.get('/', function (req, res) {
    res.send('Hello World');
  });

  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', { user: req.user });
  });

  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/auth/facebook', function (req, res, next) {
    var senderId = req.query.senderId;
    var pat = req.query.pat;

    var accountLinkingToken = req.query.account_linking_token;
    var redirectURI = req.query.redirect_uri;
    var authCode = "1234567890";
    var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;
    req.session.redirectURI = redirectURI;
    req.session.authCode = authCode;
    passport.authenticate('facebook', {
      scope: 'email'
    })(req, res, next);
  });

  app.get('/api/auth/facebook/callback', function (req, res, next) {
    passport.authenticate('facebook', function (err, user, info) {
      if (err) return next(err);
      if (!user) return res.send({ 'error': 'user not found' });

      console.log('user info');
      console.log(user);
      req.login(user, function (err) {
        console.log('LOGGING IN USER from callback');
        if (err) return next(err);

        return res.redirect(req.session.redirectURI + '&authorization_code=' + req.session.authCode);
      });
    })(req, res, next);
  });

  app.use('/fbbot/webhook', require('./fbbot/webhook'));
};