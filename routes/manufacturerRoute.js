const express = require("express");
const router = express.Router();
const manufacturerController = require("../controllers/manufacturerController");

/* Get Route */
router.get("/", manufacturerController.getAllManufacturers);
router.get("/:manu_id", manufacturerController.getManufacturerById);
router.get("/:manu_name", manufacturerController.getManufacturerByName);

/* Post Route */
router.post("/", manufacturerController.createManufacturer);

module.exports = router;