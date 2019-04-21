const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

const productController = require('./controllers/product');
const userController = require('./controllers/user');
const authController = require('./controllers/auth');
const clientController = require('./controllers/client');
const oauth2Controller = require('./controllers/oauth2');

mongoose.connect('mongodb://test123:test123@ds349065.mlab.com:49065/oauth2-server');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  next();
});

const router = express.Router();

router.route('/products')
  .post(authController.isAuthenticated, productController.postProduct)
  .get(authController.isAuthenticated, productController.getProducts);

router.route('/products/:product_id')
  .get(authController.isAuthenticated, productController.getProduct)
  .put(authController.isAuthenticated, productController.putProduct)
  .delete(authController.isAuthenticated, productController.deleteProduct);

router.route('/users')
  .post(userController.postUser)
  .get(authController.isAuthenticated, userController.getUsers);

router.route('/clients')
  .post(authController.isAuthenticated, clientController.postClient)
  .get(authController.isAuthenticated, clientController.getClients)

router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

router.route('/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);

app.use('/api', router);

app.listen(9000);
