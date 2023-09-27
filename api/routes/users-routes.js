const express = require("express");
const { check } = require("express-validator");
const usersControllers = require("../controllers/users-controller");
const fileUpoad = require("../middleware/file-upload");

const router = express.Router();

router.get("/", usersControllers.getAllUsers);
router.post(
  "/signup",
  fileUpoad.single("image"), // It's a group of MWs from multer, which will look for the key 'image'
  [
    check("name").isLength({ min: 2 }),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength(6),
  ],
  usersControllers.signup
);
router.post("/login", usersControllers.login);

module.exports = router;
