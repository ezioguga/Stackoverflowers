const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Post = require("../models/Post");
const User = require("../models/User");

// @desc    Create a post
// @route   POST /api/v1/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const newPost = new Post({
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id,
  });

  const post = await newPost.save();

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc    Get all posts
// @route   POST /api/v1/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().sort({ date: -1 });

  res.status(200).json({
    success: true,
    data: posts,
  });
});

// @desc    Get post by id
// @route   POST /api/v1/posts/:id
// @access  Private
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse("No Post found", 404));
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Delete a post
// @route   DELETE /api/v1/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse("No Post found", 404));
  }

  // Check user
  if (post.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("User Not Authorized to delete the post", 403)
    );
  }

  await post.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Like a Post
// @route   PUT /api/v1/posts/like/:id
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  // Check if the post has already been liked
  if (
    post.likes.filter((like) => like.user.toString() === req.user.id).length > 0
  ) {
    return next(new ErrorResponse("Post already liked", 400));
  }

  post.likes.unshift({ user: req.user.id });

  await post.save();

  res.status(200).json({
    success: true,
    data: post.likes,
  });
});

// @desc    Unlike a Post
// @route   PUT /api/v1/posts/unlike/:id
// @access  Private
exports.unLikePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  // Check if the post has already been liked
  if (
    post.likes.filter((like) => like.user.toString() === req.user.id).length ===
    0
  ) {
    return next(new ErrorResponse("Post is not yet liked", 400));
  }

  // Get remove index
  const removeIndex = post.likes
    .map((like) => like.user.toString())
    .indexOf(req.user.id);

  post.likes.splice(removeIndex, 1);

  await post.save();

  res.status(200).json({
    success: true,
    data: post.likes,
  });
});

// @desc    Comment on a post
// @route   PUT /api/v1/posts/comment/:id
// @access  Private
exports.commentPost = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const post = await Post.findById(req.params.id);

  const newComent = {
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id,
  };

  post.comments.unshift(newComent);

  await post.save();

  res.status(200).json({
    success: true,
    data: post.comments,
  });
});

// @desc    Delete comment
// @route   DELETE /api/v1/posts/comment/:id/:comment_id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  // Pull out comment
  const comment = post.comments.find(
    (comment) => comment.id === req.params.comment_id
  );

  // Make sure comment exists
  if (!comment) {
    return next(new ErrorResponse("Comment does not exist", 404));
  }

  // Check user
  if (comment.user.toString() !== req.user.id) {
    return next(new ErrorResponse("User not authorized", 403));
  }

  // Get remove index
  const removeIndex = post.comments
    .map((comment) => comment.user.toString())
    .indexOf(req.user.id);

  post.comments.splice(removeIndex, 1);

  await post.save();

  res.status(200).json({
    success: true,
    data: post.comments,
  });
});
