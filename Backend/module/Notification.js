const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: String,
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    seen: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
