const Joi = require("joi");

exports.validateUserInfoUpdateReq = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    contactInfo: Joi.string().min(10).required(),
  });

  return schema.validate(user);
};
