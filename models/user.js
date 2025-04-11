import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    name: { type: String },
    password: { type: String },
    photo: { type: String },
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true, // ✅ đúng chỗ
  }
);

// ✅ Hash password trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Gravatar (ảnh đại diện)
userSchema.methods.gravatar = function (size = 20) {
  if (!this.email) return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  const md5 = crypto.createHash("md5").update(this.email).digest("hex");
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

// ✅ So sánh mật khẩu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
