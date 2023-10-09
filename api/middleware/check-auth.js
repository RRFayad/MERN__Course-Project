const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    // To not block the options req the browser automatically sends
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authirization: 'Bearer TOKEN'
    if (!token) {
      return next(new HttpError("Authentication Failed", 401));
    }
    const { userId } = jwt.verify(token, "supersecret_dont_share"); // I got the Id, as I added it as Payload when created the jwt in the controller
    req.userData = { userId }; // Here I am adding data to the request
    next();
  } catch (err) {
    return next(new HttpError("Authentication Failed", 401));
  }
};
