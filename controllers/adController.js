const { Ad, validate } = require("../models/AdModel");
const { User } = require("../models/userModel");
const _ = require("lodash");
const { validateAdUpdateReq } = require("../validators/adValidator");
exports.createAd = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let ad = new Ad(
    _.pick(req.body, [
      "user",
      "name",
      "description",
      "date",
      "category",
      "location",
    ])
  );

  ad.save()
    .then((ad) => {
      const userId = ad.user;
      User.findOneAndUpdate(
        { _id: userId },
        { $push: { postedAds: ad._id } }
      ).exec();
    })
    .catch((err) => console.log(err));

  res.send(ad);
};

exports.deleteAd = async (req, res) => {
  const ad = await Ad.findByIdAndDelete(req.params.id);

  if (!ad)
    return res
      .status(404)
      .send(`The Ad with the given Id ${req.params.id} doesn't exist`);

  res.send(ad);
};

exports.updateAd = async (req, res) => {
  const { error } = validateAdUpdateReq(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const ad = await Ad.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  );

  if (!ad)
    return res
      .status(404)
      .send(`The Ad with the given Id ${req.params.id} doesn't exist`);

  res.send(ad);
};

exports.getAds = async (req, res) => {
  const ads = await Ad.find().sort("name");
  res.send(ads);
};

exports.getAd = async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  res.send(ad);
};
