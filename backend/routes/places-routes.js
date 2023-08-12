const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Budapest Parliament",
    description: "One of the most beautifuls parliaments in the world",
    imageUrl:
      "https://www.historyhit.com/app/uploads/fly-images/5158752/parliament-budapest-788x537.jpg",
    address: "Budapest, Kossuth Lajos tér 1-3, 1055 Hungria",
    location: {
      lat: 47.5070988,
      lng: 19.0405461,
    },
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((item) => item.id === placeId);

  if (!place) {
    const error = new Error("Could not find a place for the provided Id.");
    error.code = 404;
    // throw error;    // It could be throw for sync code
    return next(error);
  }
  res.json(place);
});

//Just to remember, if it was only "/user", it should become before the dynamic route above, as "user" would be interpreted as the :pid value
router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((item) => item.creator === userId);

  if (!places.length) {
    const error = new Error("Could not find a place for the provided user Id.");
    error.code = 404;
    return next(error);
  }

  res.json({ places });
});

module.exports = router;
