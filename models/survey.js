'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Survey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Survey.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: 'id'
        },
      },
      title: DataTypes.STRING,
      url: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Survey",
    }
  );
  return Survey;
};