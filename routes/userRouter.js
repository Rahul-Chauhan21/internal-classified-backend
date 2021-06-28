const auth = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();
const {
  signUp,
  updateUserInfo,
  getUserInfo,
} = require("../controllers/userController");
//Sign up
router.post("/", signUp);

//update user-info details
router.put("/:id", auth, updateUserInfo);

//get user-info
router.get("/me", auth, getUserInfo);

module.exports = router;
