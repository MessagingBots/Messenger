'use strict';

module.exports = function (req, res) {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
};