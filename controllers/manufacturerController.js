const Manufacturer = require("../models/Manufacturer");

exports.getAllManufacturers = async (req, res) => {
  try {
    const manufacturers = await Manufacturer.findAll();
    res.status(200).json(manufacturers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getManufacturerById = async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findOne({
      where: { manu_id: req.params.manu_id },
    });
    if (manufacturer) {
      res.status(200).json(manufacturer);
    } else {
      res.status(404).json({ message: "Manufacturer not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getManufacturerByName = async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findOne({
      where: { manu_name: req.params.manu_name },
    });
    if (manufacturer) {
      res.status(200).json(manufacturer);
    } else {
      res.status(404).json({ message: "Manufacturer not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createManufacturer = async (req, res) => {
  try {
    const manufacturer = await Manufacturer.create(req.body);
    res.status(201).json(manufacturer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};