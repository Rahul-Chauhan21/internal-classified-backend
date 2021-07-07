const Joi = require("joi");

exports.validateAdUpdateReq = (ad) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(10).required(),
    category: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required(),
    status: Joi.string(),
    isVisible: Joi.boolean(),
    isCommentable: Joi.boolean(),
  });
  return schema.validate(ad);
};
