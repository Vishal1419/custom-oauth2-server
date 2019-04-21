const User = require('../models/user');

exports.postUser = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save((err, user) => {
    if (err) return res.send(err);
    res.json({ message: 'New user added successfully!' });
  });
};

exports.getUsers = (req, res) => {
  User.find((err, users) => {
    if (err) return res.send(err);
    res.json(users);
  });
};
