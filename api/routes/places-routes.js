const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

//Just to remember, if it was only "/user", it should become before the dynamic route above, as "user" would be interpreted as the :pid value
router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.use(checkAuth);
// Remembering that the code is read from top to bottom - which means all the below middlewares will only get reached after this middleware

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    // check("address").not().isEmpty(),
  ],
  placesControllers.updatePlaceById
);

router.delete("/:pid", placesControllers.deletePlaceById);

module.exports = router;
