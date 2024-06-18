const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Certifications = require("./Certifications");
const PL = require("./PL");

class PL_Certifications extends Model {}

PL_Certifications.init(
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
    cert_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Certifications, // reference to the Certifications model
        key: "cert_id",
      },
    },
  },
  {
    sequelize,
    modelName: "PL_Certifications",
  }
);

module.exports = PL_Certifications;
