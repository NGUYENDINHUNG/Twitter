import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.js";

//lưu thông tin vaof session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// lấy thông tin từ session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Local login strategy
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email", // email là username để đăng nhập
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, req.flash("loginMessage", "No user found"));
        }

        const isMatch = user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, req.flash("loginMessage", "Wrong password"));
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

const passportConfig = passport;
export default passportConfig;
