const express = require("express");
require("dotenv").config();
const { main } = require("./config/db");
const { authRouter } = require("./routes/userAuth");
const cookieparser = require("cookie-parser");
const { redisClient } = require("./config/redis");
const app = express();

const initialiseConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log("err " + err);
  }
};
initialiseConnection();

app.use(express.json());
app.use(cookieparser());

app.use("/user", authRouter);
