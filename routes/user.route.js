const express = require("express");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  console.log("Payload:", req.body);
  const { name, email, password, role } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).send("User already registered");
    }
    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        return res.status(500).send(`Error while hashing ${err}`);
      }
      const newUser = new UserModel({
        name,
        email,
        password: hash,
        role,
      });
      await newUser.save();
      res.status(201).json({
        message: "User registered successfully",
        user: newUser,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: `Error registering user: ${error.message}`,
    });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res
          .status(500)
          .json({ message: `Error comparing passwords: ${err}` });
      }
      if (result) {
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.SECRET_KEY,
          { expiresIn: "2d" }
        );
        res.status(200).json({
          message: "Login successful",
          token,
        });
      } else {
        res.status(400).json({ message: "Invalid email or password" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
});

module.exports = userRouter;
