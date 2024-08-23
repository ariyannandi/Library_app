const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const AuthMiddleware = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send("Token not found");
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).send("Token has expired");
        }
        return res.status(403).send("Invalid token");
      }
      if (decoded) {
        const userId = decoded.id;
        const user = await UserModel.findById(userId);
        if (!user) {
          console.log("Authetication failed");
        } else {
          req.user = user;
          next();
        }
      }
    });
  } catch (error) {
    return res.status(500).send(`Error occured while authentication ${error}`);
  }
};

module.exports = AuthMiddleware;
