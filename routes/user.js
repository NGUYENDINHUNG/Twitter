import { Router } from "express";
import User from "../models/user.js";
import passport from "passport";
import passportConfig from "../config/passport.js";
const router = Router();

// GET /signup - Hiển thị form đăng ký

router.get("/signup", (req, res) => {
  res.render("accounts/signup", { message: req.flash("error") });
});

// POST /signup - Xử lý đăng ký

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email đã được sử dụng");
      return res.redirect("/signup");
    }

    const user = new User({ name, email, password });
    user.photo = user.gravatar();
    await user.save();

    req.flash("success", "Chào mừng bạn đến với ứng dụng!");
    res.redirect("/login");
  } catch (err) {
    next(err);
  }
});

// GET /login - Hiển thị form đăng nhập

router.get("/login", (req, res) => {
  if (req.user) return res.redirect("/");

  res.render("accounts/login", {
    message: req.flash("loginMessage"),
    success: req.flash("success"), // hiển thị message sau khi signup
  });
});

//POST /login - Xử lý đăng nhập với Passport

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// GET /logout - Đăng xuất

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

export default router;
