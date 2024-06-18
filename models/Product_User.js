const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Users = require("./users");
const Products = require("./Products");

class Product_User extends Model {}

Product_User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Users, // reference to the Users model
        key: "user_id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Products, // reference to the Products model
        key: "product_id",
      },
    },
    PA_date: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Product_User",
  }
);

module.exports = Product_User;
