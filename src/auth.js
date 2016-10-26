import request from 'request';

module.exports = (req, res) => {
  let senderId = req.query.senderId;
  let pat = req.query.pat;

  let accountLinkingToken = req.query.account_linking_token;
  let redirectURI = req.query.redirect_uri;
  let authCode = "1234567890";
  let redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

  request(`https://graph.facebook.com/v2.6/${senderId}?access_token=${pat}`, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      console.log('Success getting user profile');
      console.log(body);
      
    } else {
      console.log('Error getting profile information for user');
      console.log(err);
    }
  });


  console.log(redirectURISuccess);
};