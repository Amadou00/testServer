const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Certifications extends Model {}

Certifications.init(
  {
    cert_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cert_image: DataTypes.TEXT,
    cert_label: DataTypes.STRING(100)
  },
  {
    sequelize,
    modelName: "Certifications",
  }
);

module.exports = Certifications;
