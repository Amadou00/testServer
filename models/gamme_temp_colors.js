const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const TempColors = require("./TempColors");
const PL = require("./PL");

class gamme_temp_colors extends Model {}

gamme_temp_colors.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      references: {
        model: PL, // reference to the PL model
        key: "product_id",
      },
    },
    tc_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: TempColors, // reference to the TempColors model
        key: "tc_id",
      },
    },
  },
  {
    sequelize,
    modelName: "gamme_temp_colors",
  }
);

module.exports = gamme_temp_colors;
