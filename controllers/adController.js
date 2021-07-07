const { Ad, validate } = require("../models/AdModel");
const { User } = require("../models/userModel");
const { Comment } = require("../models/commentModel");
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
      "price",
      "imageUrls",
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

  res.json({ ad });
};

exports.deleteAd = async (req, res) => {
  const ad = await Ad.findByIdAndDelete(req.params.id);

  if (!ad)
    return res
      .status(404)
      .send(`The Ad with the given Id ${req.params.id} doesn't exist`);

  res.json({ deletedAd: ad });
};

exports.updateAd = async (req, res) => {
  const { error } = validateAdUpdateReq(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
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

  res.json({ ad });
};

exports.getAds = async (req, res) => {
  const posts = await Ad.find().sort("name");
  res.json({ posts });
};

exports.getAd = async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  if (!ad) return res.status(404).json({ error: `The Ad doesn't exist` });
  const userId = ad.user;

  const user = await User.findById(userId).select({
    firstName: 1,
    lastName: 1,
    contactInfo: 1,
  });

  let comments;
  if (ad.comments.length) {
    comments = await Comment.find({ _id: { $in: ad.comments } });
    res.json({
      ad,
      user,
      comments,
    });
  } else {
    comments = [];
    res.json({ ad, user, comments });
  }
};

exports.getUserCatalogueAds = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).json({ error: "Invalid User" });

  let catalogue = [];
  if (user.postedAds.length) {
    catalogue = await Ad.find({ _id: { $in: user.catalogue } });
  }
  res.json({ catalogue });
};

exports.getApprovedAds = async (req, res) => {
  const ads = await Ad.find({ status: "Approved", isVisible: true });
  res.json({ ads });
};
