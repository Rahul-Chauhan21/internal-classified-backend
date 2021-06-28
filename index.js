const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

//Routes
const auth = require("./routes/authRouter");
const users = require("./routes/userRouter");
const ads = require("./routes/adRouter");
const comments = require("./routes/commentRoute");
const app = express();

mongoose
  .connect(process.env.mongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB", err));

//middlewares
app.use(express.json());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/ads", ads);
app.use("/api/comment", comments);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
