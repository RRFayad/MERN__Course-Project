const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // This property is for code eficiency
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }], // The [] is what Type it to be an array os Ids
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema); // returns a constructor function -> also will create the name of the collection, lowercase and plural
