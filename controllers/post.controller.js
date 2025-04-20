import Post from "../models/post.model.js";

const post = {
  getAllPost: async (req, res) => {
    try {
      const data = await Post.find({})
        .populate("user", "username")
        .sort({ createdAt: -1 });
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
  getPost: async (req, res) => {
    try {
      const postId = req.params.postId;
      const data = await Post.find({ _id: postId })
        .populate("user", "username")
        .sort({ createdAt: -1 });
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const userId = req.params.uid;
      const data = await Post.find({ user: userId }).populate(
        "user",
        "username"
      );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
  createPost: async (req, res) => {
    try {
      const user = req.params.uid;
      const { title, detail, imageUrl, audioUrl } = req.body;
      const data = await Post.create({
        user,
        title,
        detail,
        imageUrl,
        audioUrl,
      });
      res.status(201).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
  deletePost: async (req, res) => {
    try {
      const postId = req.params.pid;
      const data = await Post.deleteOne({ _id: postId });
      res.status(200).json({ message: "post deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
  postLikeUnlike: async (req, res) => {
    try {
      const { userId } = req.body;
      const { postId } = req.params;

      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });

      // Check if the user already liked the post
      const isLiked = post.likes.includes(userId);

      if (isLiked) {
        // Unlike the post
        post.likes = post.likes.filter((id) => id.toString() !== userId);
        await post.save();
        return res.status(200).json({
          message: "Post unliked",
          post: post,
          liked: false,
        });
      } else {
        // Like the post
        post.likes.push(userId);
        await post.save();
        return res.status(200).json({
          message: "Post liked",
          post: post,
          liked: true,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
}; 

export default post;
