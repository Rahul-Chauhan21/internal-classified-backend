const _ = require("lodash");

module.exports = function (req, res, next) {
  const ad = req.body;
  const user = req.user;

  if (user.role === "Admin") next();
  else {
    req.body = _.omit(ad, ["isCommentable", "status"]);
    next();
  }
};
