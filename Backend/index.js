require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();

const Signup = require("./routes/user");
const post = require("./routes/post");
const Story = require("./routes/story");
app.use("/upload/post", express.static("upload/post"))

app.use("/upload/story", express.static("upload/story"))


mongoose
  .connect(process.env.DB)
  .then(() => console.log("Mongodb connect succfully!!"))
  .catch((err) => console.log("Error Occures mongodb connection!", err));

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());


app.use("/api",Signup);
app.use("/api/post", post);
app.use("/api/story", Story)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running ${PORT}`));
