// models/Tweet.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TweetSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  created: { type: Date, default: Date.now },
});

export default model("Tweet", TweetSchema);
