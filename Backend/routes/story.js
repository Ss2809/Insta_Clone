const express = require("express")
const authmiddleware = require("../middleware/auth")
const User = require("../module/user")
const Story = require("../module/story")
const multer = require("multer")

const router = express.Router()

const upload = multer({ dest: "upload/story" })

// Upload story
router.post("/upload", authmiddleware, upload.single("media"), async (req,res)=>{
  const userID = req.user._id

  const user = await User.findById(userID)
  if(!user) return res.status(404).json({message:"User not found"})

  if(!req.file) return res.status(400).json({message:"Story not uploaded"})

  const story = new Story({
    user: userID,
    media: req.file.filename
  })

  await story.save()
  res.status(201).json({message:"Story uploaded", story})
})

// Story feed
router.get("/feed", authmiddleware, async (req,res)=>{
  const user = await User.findById(req.user._id)

  const stories = await Story.find({
    user: { $in: [req.user._id, ...user.following] }
  })
  .populate("user","username dp")
  .sort({ createdAt:-1 })

  res.json({ stories })
})
router.get("/user/:id", authmiddleware, async (req,res)=>{
  const stories = await Story.find({ user:req.params.id })
    .sort({ createdAt:1 })
  res.json({ stories })
})


module.exports = router
