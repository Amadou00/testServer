const User = require("../models/users");

// get request
/**
 * Get all users
 * @returns {object} users  // array of users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/**
 * Get user by firstname
 * @param {string} firstname
 * @returns {object} user   // user object
 */
exports.getUserByFirstname = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        user_firstname: req.params.firstname,
      },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// post request
/**
 * Create a new user
 */
exports.createUser = async (req, res) => {
  try {
    const user = await User.create({
      user_email: req.body.user_email,
      user_password: req.body.user_password,
      user_name: req.body.user_name,
      user_firstname: req.body.user_firstname,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
