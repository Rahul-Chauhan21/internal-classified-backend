const { Ad } = require("../models/AdModel");
const _ = require("lodash");
const { Comment, validate } = require("../models/commentModel");

exports.postComment = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const ad = await Ad.findById(req.body.adDetails);
  if (!ad) return res.status(404).json({ error: `The Ad doesn't exist` });

  let comment = new Comment(
    _.pick(req.body, [
      "description",
      "date",
      "adDetails",
      "userDetails",
      "userId",
    ])
  );

  comment
    .save()
    .then((comment) => {
      const adId = comment.adDetails;
      Ad.findOneAndUpdate(
        { _id: adId },
        { $push: { comments: comment._id } }
      ).exec();
    })
    .catch((err) => console.log(err));
  res.json({ comment });
};
