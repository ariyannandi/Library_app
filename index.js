const dotenv = require("dotenv").config();
const express = require("express");
const connectToDB = require("./config/db");
const userRouter = require("./routes/user.route");
const cors = require("cors");
const libraryRouter = require("./routes/library.route");
const AuthMiddleware = require("./middlewares/auth.middleware");

const PORT = process.env.PORT || 7000;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/library", AuthMiddleware, libraryRouter);

app.get("/", (req, res) => {
  res.status(200).send("Server is running fine");
});

app.listen(PORT, async () => {
  try {
    await connectToDB();
    console.log(`Server is running on PORT ${PORT}`);
  } catch (error) {
    console.log(
      `Error while starting the server or connecting to the database: ${error}`
    );
  }
});
