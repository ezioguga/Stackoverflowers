const express = require("express");
const router = express.Router();

const {
  getProfiles,
  createProfile,
  getProfile,
  deleteProfile,
  updateProfileEXP,
  deleteProfileEXP,
  updateProfileEDU,
  deleteProfileEDU,
  getGithubRepos,
} = require("../controllers/profile");

const Profile = require("../models/Profile");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Profile, {
      path: "user",
      select: "name avatar",
    }),
    getProfiles
  )
  .post(protect, createProfile)
  .delete(protect, deleteProfile);

router.route("/:user_id").get(getProfile);

router.route("/experience").put(protect, updateProfileEXP);

router.route("/experience/:exp_id").delete(protect, deleteProfileEXP);

router.route("/education").put(protect, updateProfileEDU);

router.route("/education/:edu_id").delete(protect, deleteProfileEDU);

router.route("/github/:username").get(getGithubRepos);

module.exports = router;
