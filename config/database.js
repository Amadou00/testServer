const { Sequelize } = require("sequelize");

// Initialize Sequelize
const db = new Sequelize("Cielis", "postgres", "testpgAdmin", {
  host: "localhost",
  dialect: "postgres",
  define: {
    timestamps: false, // This will deactivate the "createdAt" and "updatedAt" columns
    freezeTableName: true, // This will stop Sequelize from transforming table names into plural
  },
});

module.exports = db;
