const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Manufacturer = require("./Manufacturer");

class TLS_componants extends Model {}

TLS_componants.init(
  {
    comp_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comp_description: DataTypes.TEXT,
    comp_reference: DataTypes.STRING(300),
    comp_version: DataTypes.STRING(50),
    comp_index: DataTypes.STRING(50),
    comp_numReserve: DataTypes.STRING(100),
    TLS_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "TLS", // reference to the TLS model
        key: "TLS_id",
      },
    },
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
    modelName: "TLS_componants",
  }
);

module.exports = TLS_componants;
