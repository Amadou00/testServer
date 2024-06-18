const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

/* Get Route */
router.get("/", productController.getAllProducts);
router.get("/:product_id", productController.getProductById);
router.get("/:product_label", productController.getProductByName);
/* Post Route */
router.post("/", productController.createProduct);

module.exports = router;