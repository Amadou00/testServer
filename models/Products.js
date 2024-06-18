const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Manufacturer = require("./Manufacturer");
class Products extends Model {}

Products.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_label: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    product_model: DataTypes.STRING(100),
    product_delete: DataTypes.BOOLEAN,
    manu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Manufacturer, // reference to the Manufacturer model
        key: "manu_id",
      },
    },
  },
  {
    sequelize,
    modelName: "Products",
  }
);

module.exports = Products;
