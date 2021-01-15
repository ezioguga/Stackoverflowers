const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const axios = require("axios");
const Profile = require("../models/Profile");
const User = require("../models/User");

// @desc    Get all profiles
// @route   GET /api/v1/profile
// @access  Public
exports.getProfiles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Create/Update user profile
// @route   POST /api/v1/profile
// @access  Private
exports.createProfile = asyncHandler(async (req, res, next) => {
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(",").map((skill) => skill.trim());
  }

  // Build social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  let profile = await Profile.findOne({ user: req.user.id });

  if (profile) {
    // Update
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true }
    );

    return res.json(profile);
  }

  // Create
  profile = new Profile(profileFields);

  await profile.save();

  res.status(201).json({
    success: true,
    data: profile,
  });
});

// @desc    Get profile by user id
// @route   GET /api/v1/profile/:user_id
// @access  Public
exports.getProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({
    user: req.params.user_id,
  }).populate("user", ["name", "avatar"]);

  if (!profile) {
    return next(new ErrorResponse("No Profile found", 404));
  }

  res.status(200).json({
    success: true,
    data: profile,
  });
});

// @desc    Delete profile, user & posts
// @route   DELETE /api/v1/profile
// @access  Private
exports.deleteProfile = asyncHandler(async (req, res, next) => {
  // @todo - remove users posts

  // Remove profile
  await Profile.findOneAndRemove({ user: req.user.id });

  // Remove user
  await User.findOneAndRemove({ _id: req.user.id });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Add profile experience
// @route   PUT /api/v1/profile/experience
// @access  Private
exports.updateProfileEXP = asyncHandler(async (req, res, next) => {
  const { title, company, location, from, to, current, description } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };

  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse("No Profile found", 404));
  }

  profile.experience.unshift(newExp);

  await profile.save();

  res.status(200).json({
    success: true,
    data: profile,
  });
});

// @desc    Delete experience from profile
// @route   DELETE /api/v1/profile/experience/exp_id
// @access  Private
exports.deleteProfileEXP = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse("No Profile found", 404));
  }

  // Get remove index
  const removeIndex = profile.experience
    .map((item) => item.id)
    .indexOf(req.params.exp_id);

  profile.experience.splice(removeIndex, 1);

  await profile.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Add profile education
// @route   PUT /api/v1/profile/education
// @access  Private
exports.updateProfileEDU = asyncHandler(async (req, res, next) => {
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };

  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse("No Profile found", 404));
  }

  profile.education.unshift(newEdu);

  await profile.save();

  res.status(200).json({
    success: true,
    data: profile,
  });
});

// @desc    Delete education from profile
// @route   DELETE /api/v1/profile/education/edu_id
// @access  Private
exports.deleteProfileEDU = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    return next(new ErrorResponse("No Profile found", 404));
  }
  // Get remove index
  const removeIndex = profile.education
    .map((item) => item.id)
    .indexOf(req.params.edu_id);

  profile.education.splice(removeIndex, 1);

  await profile.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get repositories github profile
// @route   GET /api/v1/profile/github/:username
// @access  Public
exports.getGithubRepos = asyncHandler(async (req, res, next) => {
  const repo = await axios.get(
    `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUBCLIENTID}&client_secret=${process.env.GITHUBSECRET}`
  );

  if (!repo) {
    return next(new ErrorResponse(`No Github profile found"`, 404));
  }

  res.status(200).json(repo.data);
});
