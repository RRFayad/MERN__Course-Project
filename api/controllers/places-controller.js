const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordinatesForAddress = require("../util/location");
const Place = require("../models/place");

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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch {
    // This error handling is for connection issues with the DB, and the second for when we don't find a specific place
    return next(
      new HttpError("Something went wrong! Please try again later", 500)
    );
  }

  if (!place) {
    return next(new HttpError("Could not find a place for th given Id", 404));
  }

  res.json({ place: place.toObject({ getters: true }) }); // this will make it returns as an JS object, and also a 'clean' id, without the _id
  // res.json(place);
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places = [];
  try {
    places = await Place.find({ creator: userId });
  } catch {
    return next(
      new HttpError("Something went wrong! Please try again later", 500)
    );
  }

  if (!places.length) {
    return next(
      new HttpError("Could not find a place for the provided user Id.", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
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

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://www.historyhit.com/app/uploads/fly-images/5158752/parliament-budapest-788x537.jpg",
    creator,
  });

  let result;
  try {
    result = await createdPlace.save(); // save() comes from mongoose, which will store the new document in the right collection (from the model)
  } catch {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ place: result }); // 201 stand for Successfully created
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid Inputs", 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch {
    return next(
      new HttpError("Something went wrong! Please try again later", 500)
    );
  }

  if (!place) {
    return next(new HttpError("Could not find a place for th given Id", 404));
  }

  place.title = title;
  place.description = description;

  let result;
  try {
    result = await place.save();
  } catch {
    return next(new HttpError("Could not update! Please try again later", 500));
  }

  res.json({ place: result.toObject({ getters: true }) });
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
