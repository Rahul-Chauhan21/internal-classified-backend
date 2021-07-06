const mongoose = require("mongoose");
const Joi = require("joi");

const AdSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: { type: String, minlength: 3, maxlength: 255, required: true },
  description: { type: String, minlength: 10, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now },
  imageUrls: [{ type: String, required: true }],
  price: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: String, default: "Pending" },
  location: { type: String, required: true, trim: true },
  isVisible: { type: Boolean, default: true },
  isCommentable: { type: Boolean, default: true },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const validate = (ad) => {
  const schema = Joi.object({
    user: Joi.objectId().required(),
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().required(),
    date: Joi.date().required(),
    category: Joi.string().required(),
    location: Joi.string().required(),
    imageUrls: Joi.array().items(Joi.string()).required(),
  });
  return schema.validate(ad);
};

const Ad = mongoose.model("Ad", AdSchema);

exports.Ad = Ad;
exports.validate = validate;
