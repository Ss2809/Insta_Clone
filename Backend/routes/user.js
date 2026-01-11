const express = require("express");
const User = require("../module/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Post = require("../module/post");
const Notification = require("../module/Notification");

const authmiddleware = require("../middleware/auth");
const sendSMTPEmail = require("../config/smtp");
const router = express.Router();

router.get("/:userId/notifications", authmiddleware, async (req, res) => {
const notes = await Notification.find({ user: req.params.userId })
  .populate("from", "username dp")
  .populate("post", "media")   // 👈 ADD THIS
  .sort({ createdAt: -1 });


  res.json(notes);
});

router.patch("/:userId/notifications/seen", authmiddleware, async (req, res) => {
  await Notification.updateMany(
    { user: req.params.userId, seen: false },
    { $set: { seen: true } }
  );
  res.json({ message: "All notifications marked as seen" });
});
router.get("/:userId/notifications/unseen-count", authmiddleware, async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.params.userId,
    seen: false
  });
  res.json({ count });
});



//SignUP
router.post("/Signup", async (req, res) => {
  const { username, email, password, fullName } = req.body;
  console.log({ username, email, password, fullName });
  if (!email || !password || !username) {
    return res.json({ message: "Required filled all" });
  }
  const user = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (user) {
    return res.status(409).json({
      message:
        user.username === username
          ? "Username all ready taken"
          : "Email all ready taken",
    });
  }
  const hashpassword = await bcrypt.hash(password, 10);
  const newuser = new User({
    username,
    email,
    password: hashpassword,
    fullName,
  });
  await newuser.save();
  const accesstoken = jwt.sign(
    { _id: newuser._id, username: username },
    process.env.Access_key
  );

  const createtokenrefresh = jwt.sign(
    { _id: newuser._id },
    process.env.Refresh_key
  );

  res.cookie("refreshtoken", createtokenrefresh, {
    httpOnly: true,
    secure: false,
  });

  res.status(201).json({
    message: "Signup successful",
    accesstoken,
    newuser,
  });
});

//Login

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const accesstoken = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.Access_key,
      { expiresIn: "7d" }
    );

    const refreshtoken = jwt.sign({ _id: user._id }, process.env.Refresh_key, {
      expiresIn: "7d",
    });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: false,
    });

    return res.json({
      message: "Login success",
      accesstoken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

//Refresh
router.post("/refresh", async (req, res) => {
  // 1. Take refresh token from cookies or request body
  const refrehtoken = req.cookies.refreshtoken;
  // 2. If refresh token not present → send "Login required" response
  if (!refrehtoken) {
    return res.json({ message: "Login required" });
  }
  // 3. Verify refresh token using jwt.verify with REFRESH_SECRET
  const checktoken = await jwt.verify(refrehtoken, process.env.Refresh_key);
  // 4. If token is invalid or expired → send "Invalid refresh token"
  if (!checktoken) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
  // 5. Find user in database using decoded user id
  const user = await User.findById(checktoken._id);
  // 6. If user not found → send "User not found"
  if (!user) {
    return res.json({ message: "User not found" });
  }
  // 7. Create new ACCESS token using user id & role
  const createtokenAcces = creattoken(
    { _id: user._id, username: user.username },
    process.env.Access_key
  );
  // 8. Create new REFRESH token (optional but recommended)
  const createtokenrefresh = creattoken(
    { _id: user._id, username: user.username },
    process.env.Refresh_key
  );
  // 9. Store new refresh token in cookie or database
  res.cookie("refreshtoken", createtokenrefresh, {
    httpOnly: true,
    secure: false, //true for production time
    sameSite: "none",
  });
  // 10. Send new access token (and refresh token) in response
  res.json({ message: "new token", createtokenAcces });
  // 11. Client will use new access token for further requests
});

//Logout
router.post("/logout", async (req, res) => {
  const userfreshtoken = req.cookies.refreshtoken;

  if (!userfreshtoken) {
    return res.json({ message: "refresh token not provided" });
  }

  try {
    jwt.verify(userfreshtoken, process.env.Refresh_key);

    res.clearCookie("refreshtoken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.json({ message: "Logout successful" });
  } catch (error) {
    return res.json({ message: "Invalid refresh token" });
  }
});

//User
router.get("/user", authmiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ user });
});
//Other user profile
router.get("/user/:id", authmiddleware, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json({ user });
});

//Request to reset password
router.post("/reset-request-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ message: "email not provided!" });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.json({ message: "email not registed!!" });
  }
  const resetoken = jwt.sign(
    { _id: user._id, email: user.email,  },
    process.env.resetoken_key,
    { expiresIn: "1h" }
  );

  user.resetToken = resetoken;
  user.expiresTime = Date.now() + 60 * 60 * 1000;
  await user.save();
  // email send     //const text = `Click here to reset password: http://localhost:5173/reset/${resetoken}`;

  const subject = "Passowrd Reset request for linkify Account";
  const text = `Click here to reset password:
http://localhost:5173/reset-password/${resetoken}`;
  sendSMTPEmail(user.email, subject, text);
  res.json({ message: "Password forget link sent your email", resetoken });
});

//set password
router.post("/reset-password/:resetoken", async (req, res) => {
  const { password } = req.body;
  //console.log({ resetoken, newpassword });
  const resetoken = req.params.resetoken;
  let decoderUser;
  try {
    decoderUser = jwt.verify(resetoken, process.env.resetoken_key);
  } catch (err) {
    return res.json({ message: "token invalid " });
  }

  let user = await User.findById(decoderUser._id);

  if (
    !user ||
    user.resetToken !== resetoken ||
    user.expiresTime <= Date.now()
  ) {
    return res.json({ message: "token invalid or expire token" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = null;
  user.expiresTime = null;

  await user.save();

  res.json({ message: "password reset successfully!" });
});

const creattoken = (data, key) => {
  return jwt.sign(data, key);
};

//follow request
router.post("/:userId/follow", authmiddleware, async (req, res) => {
  const userid = req.params.userId.trim();
  const currentuserId = req.user._id.trim();

  if (userid === currentuserId) {
    return res.status(404).json({ message: "Same User || Own Account" });
  }

  const currentuser = await User.findById(currentuserId);
  if (!currentuser) return res.json({ message: "User not found" });

  const usertoFollow = await User.findById(userid);
  if (!usertoFollow) return res.json({ message: "user not found" });

  // 🔒 PRIVATE ACCOUNT
  if (usertoFollow.isPrivate) {
    if (usertoFollow.followRequest.includes(currentuserId)) {
      return res.json({ message: "Follow request already sent" });
    }

    usertoFollow.followRequest.push(currentuserId);

    const already = await Notification.findOne({
      user: userid,
      from: currentuserId,
      type: "request"
    });

    if (!already) {
      await Notification.create({
        user: userid,
        from: currentuserId,
        type: "request"
      });
    }

    await usertoFollow.save();
    return res.json({ message: "request sent..." });
  }

  // 🔓 PUBLIC ACCOUNT
  if (usertoFollow.followers.includes(currentuserId)) {
    return res.json({ message: " already user follow" });
  }

  usertoFollow.followers.push(currentuserId);
  currentuser.following.push(userid);

  const alreadyFollow = await Notification.findOne({
    user: userid,
    from: currentuserId,
    type: "follow"
  });

  if (!alreadyFollow) {
    await Notification.create({
      user: userid,
      from: currentuserId,
      type: "follow"
    });
  }

  await usertoFollow.save();
  await currentuser.save();

  res.json({ message: "following succfully!!" });
});


router.post("/reject-request/:userId", authmiddleware, async (req, res) => {
  const userid = req.params.userId.trim();

  const currentuserId = req.user._id.trim();
  //console.log({userid,currentuserId})
  if (userid === currentuserId) {
    return res.status(404).json({ message: "Same User || Own Account" });
  }
  const currentuser = await User.findById(currentuserId);
  if (!currentuser) {
    return res.json({ message: "User not found" });
  }
  const userRequest = await User.findById(userid);
  if (!userRequest) {
    return res.json({ message: "user not found" });
  }
  if (!currentuser.followRequest.includes(userid)) {
    return res.json({ message: "No follow request found!" });
  }
  const updatefollowrequest = currentuser.followRequest.filter(
    (id) => id.toString() !== userid
  );
  currentuser.followRequest = updatefollowrequest;
  await currentuser.save();
  res.json({ message: "follow request reject!" });
});

router.post("/accept-request/:userId", authmiddleware, async (req, res) => {
  const userid = req.params.userId.trim();

  const currentuserId = req.user._id.trim();
  //console.log({userid,currentuserId})
  if (userid === currentuserId) {
    return res.status(404).json({ message: "Same User || Own Account" });
  }
  const currentuser = await User.findById(currentuserId);
  if (!currentuser) {
    return res.json({ message: "User not found" });
  }
  const userRequest = await User.findById(userid);
  if (!userRequest) {
    return res.json({ message: "user not found" });
  }
  if (!currentuser.followRequest.includes(userid)) {
    return res.json({ message: "No follow request found!" });
  }
  const updatefollowrequest = currentuser.followRequest.filter(
    (id) => id.toString() !== userid
  );
  currentuser.followRequest = updatefollowrequest;
  currentuser.followers.push(userid);
  userRequest.following.push(currentuserId);
  await userRequest.save();
  await currentuser.save();
  
  res.json({ message: "follow request Accept!" });
});

router.get("/:userId/followers", authmiddleware, async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).populate(
    "followers",
    "username profilename"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    totalFollowers: user.followers.length,
    followers: user.followers,
  });
});

router.get("/:userId/following", authmiddleware, async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).populate(
    "following",
    "username profilename"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    followingTotal: user.following.length,
    followingInfo: user.following,
  });
});

router.get("/:userId/unFollow", authmiddleware, async (req, res) => {
  const userId = req.params.userId;

  const currentuserId = req.user._id;
  if (userId === currentuserId) {
    return res.status(404).json({ message: "Same User || Own Account" });
  }
  const currentuser = await User.findById(currentuserId);
  if (!currentuser) {
    return res.json({ message: "User not found" });
  }
  const usertoUnfollow = await User.findById(userId);
  if (!usertoUnfollow) {
    return res.json({ message: "user not found" });
  }
  if (!currentuser.following.includes(userId)) {
    return res.json({ message: "You are not following this user!" });
  }
  currentuser.following.pull(userId);
  usertoUnfollow.followers.pull(currentuserId);

  await currentuser.save();
  await usertoUnfollow.save();
  res.json({
    message: "Unfollowed successfully! ",
  });
});

router.patch("/user/update", authmiddleware, async (req, res) => {
  const { fullName, bio } = req.body;
  const userID = req.user._id;

  const user = await User.findById(userID);
  if (!user) return res.status(400).json({ message: "User not found" });

  user.fullName = fullName || user.fullName;
  user.bio = bio || user.bio;

  await user.save();
  res.json({ message: "Profile updated", user });
});

// when own loging and see other user
router.get("/users", authmiddleware, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "username fullName dp followers"
  );
  res.json({ users });
});

module.exports = router;
