import express from "express";
import User from "../models/user.js";
import Tweet from "../models/tweet.js";

const router = express.Router();

// Trang chủ
router.get("/", async (req, res, next) => {
  try {
    const user = req.user || null; // Lấy user từ request
    if (!user) {
      return res.render("main/landing", { user }); // Truyền user vào trang landing
    }
    const tweets = await Tweet.find({})
      .populate("owner")
      .sort("-created")
      .lean();
    res.render("main/home", {
      tweets,
      user: user.toObject(), // quan trọng
    });
    // Truyền user vào trang home
  } catch (err) {
    next(err);
  }
});

router.get("/user/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;

    const [tweets, foundUser] = await Promise.all([
      Tweet.find({ owner: userId }).populate("owner").sort("-created").lean(),
      User.findById(userId).populate("following").populate("followers").lean(),
    ]);

    if (!foundUser) {
      return res.status(404).send("User not found");
    }
    res.render("main/user", {
      tweets,
      user: req.user.toObject(),
      foundUser,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/follow/:id", async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.id;

    // Đảm bảo không tự follow chính mình
    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    // Cập nhật user hiện tại: thêm người được follow nếu chưa có
    await User.updateOne(
      { _id: currentUserId, following: { $ne: targetUserId } },
      { $push: { following: targetUserId } }
    );

    // Cập nhật người được follow: thêm follower nếu chưa có
    await User.updateOne(
      { _id: targetUserId, followers: { $ne: currentUserId } },
      { $push: { followers: currentUserId } }
    );

    res.status(200).json("Success");
  } catch (err) {
    next(err);
  }
});

export default router;
