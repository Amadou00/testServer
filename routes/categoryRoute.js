const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

/* Get Route */
router.get("/", categoryController.getAllCategories);
router.get("/:category_id", categoryController.getCategoryById);

/* Post Route */
router.post("/", categoryController.createCategory);

module.exports = router;