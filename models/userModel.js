const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 1024,
    required: true,
    trim: true,
  },
  contactInfo: { type: String, required: true, default: "" },
  postedAds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ad",
    },
  ],
  catalogue: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ad",
    },
  ],
  role: {
    type: String,
    default: "User",
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.jwtPrivateKey
  );
  return token;
};

const validate = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
    contactInfo: Joi.string().min(10).required(),
  });
  return schema.validate(user);
};

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validate = validate;
