const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
class TempColors extends Model {}

TempColors.init(
  {
    tc_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tc_color: DataTypes.STRING(50),
    tc_temp: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    tc_qualified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TempColors",
  }
);

module.exports = TempColors;
