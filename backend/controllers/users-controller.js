const { v4: uuid } = require("uuid");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Renan Fayad",
    email: "test@test.com",
    password: "test",
  },
];

const getAllUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (DUMMY_USERS.findIndex((item) => item.email === email) === -1) {
    const newUser = {
      id: uuid(),
      name,
      email,
      password,
    };

    DUMMY_USERS.push(newUser);

    return res.json({ users: DUMMY_USERS });
  }
  return next(new HttpError("E-mail already registered", 409));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find(
    (item) => item.email === email && item.password === password
  );

  if (!user) {
    return next(new HttpError("Please check your e-mail or password", 401));
  }

  res.json(user);
};

exports.getAllUsers = getAllUsers;
exports.login = login;
exports.signup = signup;
