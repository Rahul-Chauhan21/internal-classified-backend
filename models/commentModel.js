const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
  descpription: { type: String },
  date: { type: Date, default: Date.now },
  adDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ad",
    required: true,
  },
  userDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const validate = (comment) => {
  const schema = Joi.object({
    userDetails: Joi.objectId().required(),
    adDetails: Joi.objectId().required(),
    description: Joi.string().min(5).required(),
    date: Joi.date().required(),
  });
  return schema.validate(comment);
};

const Comment = mongoose.model("Comment", commentSchema);

exports.Comment = Comment;
exports.validate = validate;
