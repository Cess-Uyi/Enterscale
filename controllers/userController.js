const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../models");
const User = db.user;

const { validationResult } = require("express-validator");
const { errorResponse, successResponse } = require("../handler/response");

class Users {
  static async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 422, "validation error", errors.mapped());
    }

    try {
      // hashing the password
      const hashedPassword = await bcrypt.hash(req.body.password, 12);

      let payload = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      };

      // save to db
      // .toJSON() gets the raw data without _previousDataValues
      let newUser = await User.create(payload);
      newUser = newUser.toJSON();

      // sign token
      const token = jwt.sign(
        {
          id: newUser.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      //remove the password from the user data gotten from the db
      const { password, ...user } = newUser;

      return successResponse(res, 201, "sign up completed", {
        token,
        user,
      });
    } catch (err) {
      errorResponse(res, 500, "internal server error", err.message);
    }
  }

  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 422, "validation error", errors.mapped());
    }
    try {
      // getting the password from req.body
      const { email, password } = req.body;

      // check if email exists on db
      // .unscoped() fetches all the columns on User, even password which is excluded
      let user = await User.unscoped().findOne({ where: { email: email } });

      if (!user) {
        return errorResponse(res, 400, "invalid email or password", null);
      } else {
        // .toJSON() gets the raw data without _previousDataValues
        user = user.toJSON();

        // check validity of password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return errorResponse(res, 409, "invalid login details", null);
        } else {
          // create a token
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );

          //remove the password from the user data gotten from the db
          const { password, ...userRest } = user;

          return successResponse(res, 200, "login successful", {
            token,
            user: userRest,
          });
        }
      }
    } catch (err) {
      errorResponse(res, 500, "internal server error", err.message);
    }
  }
}

module.exports = Users;
