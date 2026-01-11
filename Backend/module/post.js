const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  caption: String,
  media: Array,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  tags: String,
  location: {type :String, default : "India"},
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
