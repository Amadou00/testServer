const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
class Images extends Model {}

Images.init(
  {
    img_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    img_image: DataTypes.TEXT,
    img_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Images",
  }
);

module.exports = Images;
