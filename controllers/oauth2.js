const oauth2orize = require('oauth2orize');

const User = require('../models/user');
const Client = require('../models/client');
const Token = require('../models/token');
const Code = require('../models/code');

const server = oauth2orize.createServer();

server.serializeClient((client, callback) => {
  return callback(null, client._id);
});

server.deserializeClient((id, callback) => {
  Client.findOne({ _id: id }, (err, client) => {
    if (err) return callback(err);
    return callback(null, client);
  });
});

server.grant(oauth2orize.grant.code((client, redirectUri, user, ares, callback) => {
  const code = new Code({
    value: uid(16),
    clientId: client._id,
    redirectUri: redirectUri,
    userId: user._id
  });

  code.save((err) => {
    if (err) return callback(err);
    callback(null, code.value);
  });
}));

server.exchange(oauth2orize.exchange.code((client, code, redirectUri, callback) => {
  Code.findOne({ value: code }, (err, authCode) => {
    if (err) return callback(err);
    if (!authCode) return callback(null, false);
    if (client._id.toString() !== authCode.clientId) return callback(null, false);
    if (redirectUri !== authCode.redirectUri) return callback(null, false);

    authCode.remove((err) => {
      if(err) return callback(err);

      const token = new Token({
        value: uid(256),
        clientId: authCode.clientId,
        userId: authCode.userId
      });

      token.save((err) => {
        if (err) return callback(err);
        callback(null, token);
      });
    });
  });
}));

exports.authorization = [
  server.authorization((clientId, redirectUri, callback) => {
    Client.findOne({ id: clientId }, (err, client) => {
      if (err) return callback(err);
      return callback(null, client, redirectUri);
    });
  }),
  (req, res) => {
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
];

exports.decision = [
  server.decision()
];

exports.token = [
  server.token(),
  server.errorHandler()
];

const uid = (len) => {
  const buf = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, chars.length - 1)]);
  }
  return buf.join('');
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
