import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
  },
  { timestamps: true }
);

const SavedPost = mongoose.model("savedPosts", savedPostSchema);

export default SavedPost;
