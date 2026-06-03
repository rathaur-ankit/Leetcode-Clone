const express = require("express");
require("dotenv").config();
const { main } = require("./config/db");
const {authRouter}= require("./routes/userAuth");
const cookieparser=require("cookie-parser");
const app = express();

main()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("Error Occured " + err.message));


app.use(express.json());
app.use(cookieparser);

app.use("/user",authRouter);
