import SavedPost from "../models/savedPost.model.js";
import Post from "../models/post.model.js";

const mySavedPost = {
  getSavedPosts: async (req, res) => {
    try {
      const { userId } = req.params;
      const data = await SavedPost.find({ user: userId }).populate({
        path: "post", // First, populate the post details
        populate: {
          path: "user", // Then, populate the user who created the post
          select: "username email", // Fetch only required fields
        },
      });
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "internal server error" });
    }
  },
  savePost: async (req, res) => {
    try {
      const { postId, userId } = req.body;

      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });

      const savedPost = await SavedPost.findOne({ user: userId, post: postId });
      if (savedPost) {
        const unSavePost = await SavedPost.findOneAndDelete({
          user: userId,
          post: postId,
        });
        if (!unSavePost)
          return res.status(404).json({ message: "Saved post not found" });

        return res.status(200).json({ message: "Post unsaved successfully" });
      }

      const newSavedPost = new SavedPost({ user: userId, post: postId });
      await newSavedPost.save();

      res.status(201).json({ message: "Post saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },
  unsavePost: async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body;
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },
};

export default mySavedPost;
