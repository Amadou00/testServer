const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
class Manufacturer extends Model {}

Manufacturer.init(
  {
    manu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    manu_name: DataTypes.STRING(50),
    manu_link: DataTypes.STRING(500),
  },
  {
    sequelize,
    modelName: "Manufacturer",
  }
);

module.exports = Manufacturer;
