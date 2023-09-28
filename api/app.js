const fs = require("fs");
const path = require("path");
const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const placeRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json()); // Added this for the body of POSTs methods that create data (such as new places)

app.use("/uploads/images", express.static(path.join("uploads", "images"))); // This MW let access to the files in the server side (for this path)

//CORS => Will set Headers for the response
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // We are allowing all URL's to interact with our API, we could specify some
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // We are allowing theses headers in the requests
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  next();
});

app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  return next(error);
});

// When there's a MW with 4 params, express will recongnize it as special, and run it only when there's an error
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => console.log(err));
  }
  if (res.hearderSent) {
    return next(error);
  }
  res.status(error.code || 500); // the property is for the developer to set, it's not an expresws feature
  res.json({ message: error.message || "An unknown error occurred" }); // This message property is  a convention
});

mongoose
  .connect(
    `mongodb+srv://renan_fayad:${process.env.MONGO_PROJECT_PASSWORD}@cluster0.1oktfwg.mongodb.net/mern`
  )
  .then(() => {
    app.listen(5000);
    console.log("Db Connected");
  })
  .catch((err) => {
    console.log(err);
  });
