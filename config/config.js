require("dotenv").config();

module.exports = {
  development: {
    url: process.env.DEV_DB_URL,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      statement_timeout: 1000,
      idle_in_transaction_session_timeout: 5000,
    },
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
    },
  },
  test: {
    url: process.env.TEST_DB_URL,
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    url: process.env.PROD_DB_URL,
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
