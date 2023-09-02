const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const user = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Renan Fayad",
    email: "test@test.com",
    password: "test",
  },
];

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

  const { name, email, password, places } = req.body;

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

  const createdUser = new User({
    name,
    email,
    image:
      "https://multiurso.com.br/wp-content/uploads/2022/08/diferenca-pato-marreco-foto-1132x670.jpg",
    password,
    places,
  });

  let result;
  try {
    result = await createdUser.save(); // save() comes from mongoose, which will store the new document in the right collection (from the model)
  } catch {
    const error = new HttpError("Signing Up failed, please try again", 500);
    return next(error);
  }

  return res.status(201).json({ user: result.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email, password });
  } catch {
    const error = new HttpError("Log in Failed - Please try Again Later", 500);
    return next(error);
  }

  if (!user) {
    return next(new HttpError("Please check your e-mail or password", 401));
  }

  res.status(201).json({ user: user.toObject({ getters: true }) });
};

exports.getAllUsers = getAllUsers;
exports.login = login;
exports.signup = signup;
