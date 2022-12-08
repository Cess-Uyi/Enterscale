const { body } = require("express-validator");

exports.CREATE = [
  body("title")
    .isString()
    .trim()
    .notEmpty()
    .toLowerCase()
    .isLength({ min: 2, max: 50 })
    .withMessage("survey title must be between 2-50 characters"),

  body("questions")
    .isArray()
    .withMessage("questions expects an array")
    .notEmpty(),

  body("questions.*").isString().trim().notEmpty().toLowerCase(),
];