const express = require("express");
const placesControllers = require("../controllers/places-controller");

const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

//Just to remember, if it was only "/user", it should become before the dynamic route above, as "user" would be interpreted as the :pid value
router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.post("/", placesControllers.createPlace);

module.exports = router;
