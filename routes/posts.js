const express = require("express");
const router = express.Router();

const {
  createPost,
  getPost,
  getPosts,
  deletePost,
  likePost,
  unLikePost,
  commentPost,
  deleteComment,
} = require("../controllers/posts");

const advancedResults = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, createPost).get(getPosts);

router.route("/:id").get(protect, getPost).delete(protect, deletePost);

router.route("/like/:id").put(protect, likePost);

router.route("/unlike/:id").put(protect, unLikePost);

router.route("/comment/:id").post(protect, commentPost);

router.route("/comment/:id/:comment_id").delete(protect, deleteComment);

module.exports = router;
