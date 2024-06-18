const express = require("express");
const router = express.Router();
const productUserController = require("../controllers/productUserController");

/* Get Route */
router.get("/", productUserController.getAllProductUsers);
router.get("/:product_id", productUserController.getProductUserByProductId);
router.get("/:user_id", productUserController.getProductUserByUserId);


module.exports = router;