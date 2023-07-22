const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const jwt = require("jsonwebtoken");

//Using multer for uploading file
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
// To Make Photos in Uploads Folder Running Online For Client to Read it
app.use("/uploads", express.static(__dirname + "/uploads"));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// To Encrypt Password
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

// Secret or Private Key For (Token)
const secret = "sadfkjsdkjafkjsdfkjsbadfkjs";

// import (UserModel)
const User = require("./models/User");
// import (PostModel)
const Post = require("./models/Post");

// Our React App Host
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

// Connect Our Database Using COnnection String
mongoose.connect(
  "mongodb+srv://Elnaggar_Blog:uHGj27Szfa9RpLCd@cluster0.2fn1osy.mongodb.net/?retryWrites=true&w=majority"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({ username, id: userDoc._id });
    });
  } catch (err) {
    res.status(400).json(null);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) {
    return res.status(404).json({ message: "User not found" });
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) {
    return res.status(401).json({ message: "Invalid password" });
  }
  jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
    if (err) throw err;
    /*
    Send (token) as json 
    res.json(token);
*/
    // Send (token) as cookies
    res.cookie("token", token).json({ username, id: userDoc._id });
  });
});

app.get("/checkToken", (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.json(null);
    } else {
      jwt.verify(token, secret, {}, (err, userInfo) => {
        if (err) throw err;
        res.json(userInfo);
      });
    }
  } catch (error) {
    res.cookie("token", "").json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json({ message: "Logout Successfully" });
});

app.post("/createPost", uploadMiddleware.single("file"), (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, userInfo) => {
    if (err) {
      return res.status(401).json({ message: "token error" });
    }
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: userInfo.id,
    });
    res.json(postDoc);
  });
});

app.put("/UpdatePost", uploadMiddleware.single("file"), (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, userInfo) => {
    if (err) {
      return res.status(401).json({ message: "token error" });
    }
    const { id, title, summary, content } = req.body;
    const oldPostDoc = await Post.findById(id);
    // const isAuthorized =
    //   JSON.stringify(oldPostDoc.author) === JSON.stringify(userInfo.id);
    const isAuthorized = oldPostDoc.author == userInfo.id; // oldPostDoc.author is type of (object id) so they are different in type
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ message: "you are not the author of the post" });
    }
    await oldPostDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : oldPostDoc.cover,
    });
    res.json(oldPostDoc);
  });
});

app.delete("/deletePost", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, userInfo) => {
    if (err) {
      return res.status(401).json({ message: "token error" });
    }
    const { id } = req.body;
    const oldPostDoc = await Post.findById(id);
    const isAuthorized = oldPostDoc.author == userInfo.id;
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ message: "you are not the author of the post" });
    }
    const ret = await oldPostDoc.deleteOne();
    res.json(ret);
  });
});

app.get("/getAllPosts", async (req, res) => {
  try {
    const allPosts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(allPosts);
  } catch (error) {
    res.status(404).json(null);
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id).populate("author", ["username"]);
    res.json(postDoc);
  } catch (error) {
    res.status(404).json(null);
  }
});

app.listen(4000);

// Uername => Elnaggar_Blog
// password => uHGj27Szfa9RpLCd

// COnnection String
//mongodb+srv://Elnaggar_Blog:<password>@cluster0.2fn1osy.mongodb.net/?retryWrites=true&w=majority

// Note
// Replace <password> with the password for the Elnaggar_Blog user.

// After Adding Password
//mongodb+srv://Elnaggar_Blog:uHGj27Szfa9RpLCd@cluster0.2fn1osy.mongodb.net/?retryWrites=true&w=majority

// We will use (Mongoose) to connect Database .So need to install it

// then Create Our (User MOdel)
