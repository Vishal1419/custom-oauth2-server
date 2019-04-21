const Product = require('../models/product');

exports.getProducts = (req, res) => {
  Product.find({ userId: req.user._id }, (err, products) => {
    if (err) return res.send(err);
    res.json(products);
  });
};

exports.getProduct = (req, res) => {
  Product.find({ userId: req.user._id, _id: req.params.product_id }, (err, product) => {
    if (err) return res.send(err);
    res.json(product);
  });
};

exports.postProduct = (req, res) => {
  const product = new Product();

  product.name = req.body.name;
  product.price = req.body.price;
  product.userId = req.user._id;

  product.save((err) => {
    if (err) return res.send(err);
    res.json({ message: 'New Product added successfully!', data: product });
  });
};

exports.putProduct = (req, res) => {
  Product.update(
    { userId: req.user._id, _id: req.params.product_id },
    { price: req.body.price },
    (err, raw) => {
      if (err) return res.send(err);
      res.json({ message: raw.n + ' updated' });
    },
  );
};

exports.deleteProduct = (req, res) => {
  Product.remove({ userId: req.user._id, _id: req.params.product_id }, (err) => {
    if (err) return res.send(err);
    res.json({ message: 'Product removed successfully!' });
  });
};