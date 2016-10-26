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
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', { user: req.user });
  });

  app.get('/login', (req, res) => {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile',
      failureRedirect : '/login',
      failureFlash : true
  }));

  app.get('/signup', (req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/auth/facebook', (req, res, next) => {
    let senderId = req.query.senderId;
    let pat = req.query.pat;

    let accountLinkingToken = req.query.account_linking_token;
    let redirectURI = req.query.redirect_uri;
    let authCode = "1234567890";
    let redirectURISuccess = redirectURI + "&authorization_code=" + authCode;
    req.session.redirectURI = redirectURI;
    req.session.authCode = authCode;
    passport.authenticate('facebook', {
      scope: 'email'
    })(req, res, next);
  });


  app.get('/api/auth/facebook/callback', (req, res, next) => {
      passport.authenticate('facebook', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.send({'error':'user not found'});

      console.log('user info');
      console.log(user);
      req.login(user, (err) => {
        console.log('LOGGING IN USER from callback');
        if (err) return next(err);

        return res.redirect(`${req.session.redirectURI}&authorization_code=${req.session.authCode}`);
      });
    })(req, res, next);
  });

  app.use('/fbbot/webhook', require('./fbbot/webhook'));
}