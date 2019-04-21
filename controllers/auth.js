const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy

const User = require('../models/user');
const Client = require('../models/client');
const Token = require('../models/token');

passport.use(new BasicStrategy((username, password, callback) => {
  User.findOne({ username }, (err, user) => {
    if (err) { return callback(err); }
    if (!user) { return callback(null, false); }

    user.verifyPassword(password, (err, isMatch) => {
      if (err) { return callback(err); }
      if (!isMatch) { return callback(null, false); }
      return callback(null, user);
    });
  });
}));

passport.use('client-basic', new BasicStrategy((username, password, callback) => {
  Client.findOne({ id: username }, (err, client) => {
    if (err) return callback(err);
    if (!client || client.secret !== password) return callback(null, false);
    return callback(null, client);
  });
}));

passport.use(new BearerStrategy((accessToken, callback) => {
  Token.findOne({ value: accessToken }, (err, token) => {
    if (err) return callback(err);
    if (!token) return callback(null, false);
    User.findOne({ _id: token.userId }, (err, user) => {
      if (err) return callback(err);
      if (!user) return callback(null, false);
      callback(null, user, { scope: '*' });
    });
  });
}));

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });