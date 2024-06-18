const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Image = require("./Image");
const Product = require("./Product");

class Image_Product extends Model {}

Image_Product.init({
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Products, // reference to the Products model
      key: 'product_id',
    },
  },
  img_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Images, // reference to the Images model
      key: 'img_id',
    },
  },
}, {
  sequelize,
  modelName: 'Image_Product',
});

module.exports = Image_Product;