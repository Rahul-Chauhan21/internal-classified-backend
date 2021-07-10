const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/userModel");
const { Ad } = require("../models/AdModel");
const { validateUserInfoUpdateReq } = require("../validators/userValidator");

exports.signUp = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(
    _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "password",
      "contactInfo",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(
      _.pick(user, ["_id", "firstName", "lastName", "email", "contactInfo"])
    );
};

exports.updateUserInfo = async (req, res) => {
  const { error } = validateUserInfoUpdateReq(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      contactInfo: req.body.contactInfo,
    },
    { new: true }
  ).select("-password");

  if (!user)
    return res
      .status(404)
      .send(`User with given Id ${req.params.id} doesn't exist`);

  res.json({ user });
};

exports.getUserInfo = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  let ads = [];
  if (user.postedAds.length) {
    ads = await Ad.find({ _id: { $in: user.postedAds } });
  }
  res.json({
    user,
    ads,
  });
};

exports.addToCatalogue = async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  if (!ad) {
    return res
      .status(400)
      .json({ error: "Ad with the given Id does not exist" });
  }

  const catalogue = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { catalogue: req.params.id } },
    { new: true }
  ).select("catalogue");

  res.send(catalogue);
};

exports.removeFromCatalogue = async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  if (!ad) {
    return res
      .status(400)
      .json({ error: "Ad with the given Id does not exist" });
  }

  const catalogue = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { catalogue: req.params.id } },
    { new: true }
  ).select("catalogue");

  res.send(catalogue);
};
