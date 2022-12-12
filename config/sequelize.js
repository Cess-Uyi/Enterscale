const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
// const sequelize = require('../models/index')

module.exports = sequelize