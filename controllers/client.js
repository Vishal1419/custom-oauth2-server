const Client = require('../models/client');

exports.getClients = (req, res) => {
  Client.find({ userId: req.user._id }, (err, clients) => {
    if (err) return res.send(err);
    res.json(clients);
  });
};

exports.postClient = (req, res) => {
  const client = new Client();

  client.name = req.body.name;
  client.id = req.body.id;
  client.secret = req.body.secret;
  client.userId = req.user._id;

  client.save((err) => {
    if (err) return res.send(err);
    res.json({ message: 'Client added successfully!', data: client });
  });
};
