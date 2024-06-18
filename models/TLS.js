const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Products = require("./Products");

class TLS extends Model {}

TLS.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Products, // reference to the Products model
        key: "product_id",
      },
    },
    TLS_quality: {
      type: DataTypes.CHAR(3),
      allowNull: false,
    },
    TLS_familly: {
      type: DataTypes.CHAR(3),
      allowNull: false,
    },
    TLS_small_label: {
      type: DataTypes.CHAR(9),
      allowNull: false,
    },
    TLS_approval_date: DataTypes.DATE,
    TLS_state: DataTypes.STRING(50),
    TLS_origins_request: DataTypes.STRING(300),
    TLS_purposes_request: DataTypes.TEXT,
    TLS_reference: DataTypes.TEXT,
    TLS_notes: DataTypes.TEXT,
    TLS_reserve_details: DataTypes.TEXT,
    auth_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      unique: true,
      references: {
        model: "AuthorizationType", // reference to the AuthorizationType model
        key: "auth_id",
      },
    },
  },
  {
    sequelize,
    modelName: "TLS",
  }
);

module.exports = TLS;
