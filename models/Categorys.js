const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Categorys extends Model {}

Categorys.init({
  cat_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cat_material_type: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  cat_category: DataTypes.STRING(300),
  cat_sub_category: DataTypes.STRING(300),
}, {
  sequelize,
  modelName: 'Categorys',
});

module.exports = Categorys;