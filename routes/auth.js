const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/auth");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", protect, logout);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
