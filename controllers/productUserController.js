const Product_User = require("../models/Product_User");

exports.getAllProductUsers = async (req, res) => {
  try {
    const productUsers = await Product_User.findAll();
    res.status(200).json(productUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductUserByProductId = async (req, res) => {
  try {
    const productUser = await Product_User.findAll({
      where: { product_id: req.params.product_id },
    });
    res.status(200).json(productUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductUserByUserId = async (req, res) => {
  try {
    const productUser = await Product_User.findAll({
      where: { user_id: req.params.user_id },
    });
    res.status(200).json(productUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};