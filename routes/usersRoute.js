const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/* Get Route */
router.get("/", userController.getAllUsers);
router.get("/:firstname", userController.getUserByFirstname);
/* Post Route */
router.post("/", userController.createUser);

module.exports = router;