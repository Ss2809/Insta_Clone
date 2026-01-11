const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  media: [{
    type: String, // image/video filename
    required: true,
  }],

  caption: String,

  viewers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // ⏳ Auto delete after 24 hours
  },
});

module.exports = mongoose.model("Story", storySchema);
