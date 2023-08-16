const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordinatesForAddress = require("../util/location");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((item) => item.id === placeId);

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided user Id.", 404)
    );
  }
  res.json(place);
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((item) => item.creator === userId);

  if (!places.length) {
    return next(
      new HttpError("Could not find a place for the provided user Id.", 404)
    );
  }

  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors);
    return next(new HttpError("Invalid Inputs", 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  // let createdPlace;

  try {
    coordinates = await getCoordinatesForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace }); // 201 stand for Successfully created
};

const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid Inputs", 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;
  const placeIndex = DUMMY_PLACES.findIndex((item) => item.id === placeId);
  const updatedPlace = { ...DUMMY_PLACES[placeIndex], title, description };

  DUMMY_PLACES.splice(placeIndex, 1, updatedPlace);

  res.json({ places: DUMMY_PLACES });
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const placeIndex = DUMMY_PLACES.findIndex((item) => item.id === placeId);

  if (placeIndex === -1) {
    return next(new HttpError("Could not find the place", 404));
  }

  DUMMY_PLACES.splice(placeIndex, 1);

  res.json({ message: "Place Deleted!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
