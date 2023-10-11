const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    //  users = await User.find({}, "email name");   // We could make this to get only for these
    users = await User.find({}, "-password"); // This will make us exclude our password
  } catch {
    const error = new HttpError(
      "Could not fetch users, please try again later",
      500
    );
    return next(error);
  }
  {
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Please insert your name, e-mail and password", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch {
    const error = new HttpError("Sign Up Failed - Please ry Again Later", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User already exists - Please Login", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not created user - Please try again",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: `${req.file.path}`,
    password: hashedPassword,
    places: [],
  });

  let result;
  try {
    result = await createdUser.save(); // save() comes from mongoose, which will store the new document in the right collection (from the model)
  } catch {
    const error = new HttpError("Signing Up failed, please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("SignUp Failed, please try again later", 500));
  }

  const decodedToken = jwt.decode(token);
  const expirationTime = decodedToken.exp * 1000;

  return res.status(201).json({
    usedId: createdUser.id,
    email: createdUser.email,
    token,
    expirationTime,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email });
  } catch {
    const error = new HttpError("Log in Failed - Please try Again Later", 500);
    return next(error);
  }

  if (!user) {
    return next(new HttpError("Please check your e-mail or password", 403));
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    return next(new HttpError("Sign Up failed", 403));
  }

  if (!isValidPassword) {
    return next(new HttpError("Password did not match", 403));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(
      new HttpError("Logging in Failed, please try again later", 500)
    );
  }

  const decodedToken = jwt.decode(token);
  const expirationTime = decodedToken.exp * 1000;

  res
    .status(201)
    .json({ userId: user.id, email: user.email, token, expirationTime });
};

exports.getAllUsers = getAllUsers;
exports.login = login;
exports.signup = signup;
