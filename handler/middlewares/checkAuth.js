const jwt = require("jsonwebtoken");
const { errorResponse } = require("../response");
const dotenv = require("dotenv").config();

const db = require("../../models");
const User = db.user;

const checkAuth = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    return errorResponse(res, 401, "no token", null);
  }
  try {
    // fetch the user from the token
    const token = bearerToken.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return errorResponse(res, 401, "invalid signature token", null);
    }
    let foundUser = await User.findOne({
      where: { id: verifyToken.id },
      attributes: { exclude: ["password"] },
    });
    foundUser = foundUser.toJSON()

    if (!foundUser) {
      return errorResponse(res, 404, "user not found", null);
    }
    req.user = foundUser;
    next();
  } catch (err) {
    errorResponse(res, 500, "internal server error", err.message);
  }
};

module.exports = checkAuth;
