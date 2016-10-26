"use strict";

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (req, res) {
  var senderId = req.query.senderId;
  var pat = req.query.pat;

  var accountLinkingToken = req.query.account_linking_token;
  var redirectURI = req.query.redirect_uri;
  var authCode = "1234567890";
  var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

  (0, _request2.default)("https://graph.facebook.com/v2.6/" + senderId + "?access_token=" + pat, function (err, res, body) {
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