import Comment from "../models/comment.model.js";

const comment = {
  getAllComment: async (req, res) => {
    try {
      const postId = req.params.pid;
      if (!postId) return res.status(400).json({ error: "Post-Id not found" });
      const data = await Comment.find({ post: postId })
        .populate("user", "username")
        .sort({ createdAt: -1 });
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
  postComment: async (req, res) => {
    try {
      const pid = req.params.pid;
      const { userId, desc } = req.body;

      switch (true) {
        case !pid:
          res.status(400).json({ error: "Post-Id not found" });
          break;
        case !userId:
          res.status(400).json({ error: "User-Id not found" });
          break;
        case !desc:
          res.status(400).json({ error: "Desc not found" });
          break;
      }

      const postComment = await Comment.create({
        user: userId,
        post: pid,
        desc,
      });
      res.status(201).json({ data: postComment });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const cid = req.params.cid;
      if (!cid) return res.status(400).json({ error: "Unauthorized request" });
      const data = await Comment.deleteOne({ _id: cid });
      res.status(200).json({ message: "comment deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
};

export default comment;
