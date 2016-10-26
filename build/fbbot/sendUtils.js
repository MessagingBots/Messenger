'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendTypingOn = exports.sendQuickReply = exports.sendButtonMessage = exports.sendFileMessage = exports.sendTextMessage = exports.sendAccountLinking = exports.callSendAPI = undefined;

var _default = require('../config/default');

var _default2 = _interopRequireDefault(_default);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var API_URL = process.env.NODE_ENV === 'prod' ? _default2.default.prod.API_URL : _default2.default.dev.API_URL;
var SERVER_URL = process.env.NODE_ENV === 'prod' ? _default2.default.prod.SERVER_URL : _default2.default.dev.SERVER_URL;

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData) {
  (0, _request2.default)({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: _default2.default.fb.pageAccessToken },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s", messageId, recipientId);
      } else {
        console.log("Successfully called Send API for recipient %s", recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });
}

/*
 * Send a message with the account linking call-to-action
 *
 */
function sendAccountLinking(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Welcome. Link your account.",
            image_url: SERVER_URL + 'assets/thumbsup.png',
            buttons: [{
              type: "account_link",
              url: API_URL + 'auth/facebook?senderId=' + recipientId + '&pat=' + _default2.default.fb.pageAccessToken
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a file using the Send API.
 *
 */
function sendFileMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "file",
        payload: {
          url: SERVER_URL + 'assets/test.txt'
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a button message using the Send API.
 *
 */
function sendButtonMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "This is test text",
          buttons: [{
            type: "web_url",
            url: "https://www.oculus.com/en-us/rift/",
            title: "Open Web URL"
          }, {
            type: "postback",
            title: "Trigger Postback",
            payload: "DEVELOPED_DEFINED_PAYLOAD"
          }, {
            type: "phone_number",
            title: "Call Phone Number",
            payload: "+16505551234"
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a message with Quick Reply buttons.
 *
 */
function sendQuickReply(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "What's your favorite movie genre?",
      quick_replies: [{
        "content_type": "text",
        "title": "Action",
        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
      }, {
        "content_type": "text",
        "title": "Comedy",
        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
      }, {
        "content_type": "text",
        "title": "Drama",
        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
      }]
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a read receipt to indicate the message has been read
 *
 */
function sendReadReceipt(recipientId) {
  console.log("Sending a read receipt to mark message as seen");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "mark_seen"
  };

  callSendAPI(messageData);
}

/*
 * Turn typing indicator on
 *
 */
function sendTypingOn(recipientId) {
  console.log("Turning typing indicator on");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };

  callSendAPI(messageData);
}

exports.callSendAPI = callSendAPI;
exports.sendAccountLinking = sendAccountLinking;
exports.sendTextMessage = sendTextMessage;
exports.sendFileMessage = sendFileMessage;
exports.sendButtonMessage = sendButtonMessage;
exports.sendQuickReply = sendQuickReply;
exports.sendTypingOn = sendTypingOn;