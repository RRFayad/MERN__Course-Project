const axios = require("axios");
require("dotenv").config();

const HttpError = require("../models/http-error");

const getCoordinatesForAddress = async (address) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
    address
  )}&key=${process.env.GOOGLE_API_KEY}`;

  const response = await axios.get(url);
  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError("Could not find location", 422);
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

module.exports = getCoordinatesForAddress;
