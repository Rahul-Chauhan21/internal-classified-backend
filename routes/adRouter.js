const express = require("express");
const router = express.Router();
const {
  createAd,
  getAds,
  deleteAd,
  updateAd,
  getAd,
} = require("../controllers/adController");
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");
const adbodyhandler = require("../middlewares/adbodyMiddleware");
//create Ad
router.post("/", auth, createAd);

//fetch all ads
router.get("/", auth, admin, getAds);

router.get("/:id", getAd);

router.put("/:id", auth, adbodyhandler, updateAd);

//catalogue route

router.delete("/:id", auth, deleteAd);

module.exports = router;
