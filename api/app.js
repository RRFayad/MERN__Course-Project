const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const placeRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json()); // Added this for the body of POSTs methods that create data (such as new places)

app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  return next(error);
});

// When there's a MW with 4 params, express will recongnize it as special, and run it only when there's an error
app.use((error, req, res, next) => {
  if (res.hearderSent) {
    return next(error);
  }
  res.status(error.code || 500); // the property is for the developer to set, it's not an expresws feature
  res.json({ message: error.message || "An unknown error occurred" }); // This message property is  a convention
});

mongoose
  .connect(
    `mongodb+srv://renan_fayad:${process.env.MONGO_PROJECT_PASSWORD}@cluster0.1oktfwg.mongodb.net/`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
