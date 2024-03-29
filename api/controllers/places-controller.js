const fs = require("fs");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordinatesForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

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
    // places = await Place.find({ creator: userId });
    const polulatedUser = await User.findById(userId).populate("places"); // Just to show other approach
    places = polulatedUser.places;
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

  const { title, description, address } = req.body;

  let coordinates;

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
    image: req.file.path,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch {
    const error = new HttpError("Fetching user failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session });
    // IMPORTANT: If there's no collection yet, we will have to create it manually, in a session it's not automatically created!
    await user.places.push(createdPlace);
    await user.save({ session }); // push is the mongoose method not the JS' AND it only saves the palceId
    await session.commitTransaction(); // Only here the changes are saved in the Db
  } catch {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) }); // 201 stand for Successfully created
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

  //Authorization
  if (place.creator.toString() !== req.userData.userId) {
    // I must convert the ObjectId toString() for the comparisson
    // I added this userData in the req in the check-auth MW
    return next(new HttpError("You are not allowed to edit this place", 401));
  }

  place.title = title;
  place.description = description;

  let result;
  try {
    result = await place.save();
  } catch (err) {
    return next(
      new HttpError(`Could not update! Please try again later - ${err}`, 500)
    );
  }

  res.json({ place: result.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch {
    return next(
      new HttpError(
        "Something went wrong fetching the place! Please try again later",
        500
      )
    );
  }

  if (!place) {
    return res.json({ message: "Could not find specified place or user" });
  }

  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError("You are not allowed to delete this place", 401));
  }

  const imagePath = place.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.deleteOne({ session });
    place.creator.places.pull(place); // pull is the mongoose method to remove from an array
    await place.creator.save({ session });
    await session.commitTransaction(); // Only here the changes are saved in the Db
  } catch (err) {
    const error = new HttpError(
      "Deleting place failed, please try again" + err,
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => console.log(err));

  res.json({ message: "Place Deleted Successfully" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
