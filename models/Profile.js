const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: [true, "please add the status"],
  },
  skills: {
    type: [String],
    required: [true, "please add your skills"],
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },
  experience: [
    {
      title: {
        type: String,
        required: [true, "please add a title"],
      },
      company: {
        type: String,
        required: [true, "please add a company"],
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        required: [true, "please add a from"],
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        required: [true, "please add your school"],
      },
      degree: {
        type: String,
        required: [true, "please add your degree"],
      },
      fieldofstudy: {
        type: String,
        required: [true, "please add your field of study"],
      },
      from: {
        type: Date,
        required: [true, "please add a from"],
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
