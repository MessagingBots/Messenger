module.exports = (req, res) => {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
};