const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Categorys = require("./Categorys");
const Products = require("./Products");
class PL extends Model {}

PL.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      references: {
        model: Products, // reference to the Products model
        key: "product_id",
      },
    },
    PL_range_description: DataTypes.TEXT,
    PL_range_mfb: DataTypes.STRING(100),
    PL_range_max_allow_config: DataTypes.STRING(100),
    PL_range_max_angle: DataTypes.STRING(100),
    PL_installation_place: DataTypes.STRING(300),
    PL_voltage: DataTypes.DECIMAL(15, 2),
    PL_warranty_period: DataTypes.SMALLINT,
    PL_description: DataTypes.TEXT,
    PL_tech_charac: DataTypes.TEXT,
    PL_terms_of_use: DataTypes.TEXT,
    PL_num_page: DataTypes.SMALLINT,
    cat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Categorys, // reference to the Categorys model
        key: "cat_id",
      },
    },
  },
  {
    sequelize,
    modelName: "PL",
  }
);

module.exports = PL;