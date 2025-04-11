import Tweet from "../models/tweet.js";
import User from "../models/user.js";

export default function (io) {
  io.on("connection", (socket) => {
    console.log("a user connected");

    const user = socket.request.user;

    socket.on("tweet", async (data) => {
      try {
        io.emit("iscomingTweets", { data, user });
        io.emit("incomingTweets", { data, user });

        // 2. Tạo tweet mới
        const tweet = new Tweet({
          owner: user._id,
          content: data.content,
        });

        const savedTweet = await tweet.save();

        // 3. Cập nhật user (thêm tweet vào mảng tweets)
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          {
            $push: {
              tweets: {
                tweet: savedTweet._id,
                content: savedTweet.content,
              },
            },
          },
          { new: true }
        );
      } catch (err) {
        console.error("Error processing tweet:", err);
        socket.emit("tweetError", { message: "Tweet failed", error: err });
      }
    });
  });
}
