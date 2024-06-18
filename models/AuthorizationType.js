const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
class AuthorizationType extends Model {}

AuthorizationType.init(
  {
    auth_id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true,
    },
    auth_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    auth_quantity: DataTypes.INTEGER,
    auth_limit_date: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "AuthorizationType",
  }
);

module.exports = AuthorizationType;
