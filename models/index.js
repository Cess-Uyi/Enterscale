const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.user = require("./user")(sequelize, DataTypes);
db.survey = require("./survey")(sequelize, DataTypes);
db.question = require("./question")(sequelize, DataTypes);
db.answer = require("./answer")(sequelize, DataTypes);

/* DEFINING TABLE RELATIONSHIPS */

// One-To-Many Relationship between User and Survey
db.user.hasMany(db.survey, { foreignKey: 'userId' });
db.survey.belongsTo(db.user, { foreignKey: "userId" });

// One-To-Many Relationship between Survey and Question
db.survey.hasMany(db.question, { foreignKey: "surveyId" });
db.question.belongsTo(db.survey, { foreignKey: "surveyId" });

// One-To-Many Relationship between Question and Answer
db.question.hasMany(db.answer, { foreignKey: "questionId" });
db.answer.belongsTo(db.question, { foreignKey: "questionId" });


module.exports = db;
