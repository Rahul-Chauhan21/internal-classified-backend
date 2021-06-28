const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const { postComment } = require("../controllers/commentController");

router.post("/", auth, postComment);

module.exports = router;
