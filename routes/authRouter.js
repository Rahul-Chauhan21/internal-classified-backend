const express = require("express");
const _ = require("lodash");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ error: "Invalid email or password." });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Invalid email or password." });

  const token = user.generateAuthToken();

  const {
    postedAds,
    catalogue,
    firstName,
    lastName,
    contactInfo,
    email,
    _id,
    role,
  } = user;

  res.json({
    token,
    postedAds,
    catalogue,
    firstName,
    lastName,
    contactInfo,
    email,
    _id,
    role,
  });
});

const validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().required(),
  });

  return schema.validate(req);
};

module.exports = router;
