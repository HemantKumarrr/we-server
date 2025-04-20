import User from "../models/user.model.js";
import Post from "../models/post.model.js";

const userFn = {
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.uid;
      const data = await User.deleteOne({ _id: userId });
      const deletePosts = await Post.deleteMany({ user: userId });
      res.status(200).json({ message: "user account deleted" });
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const { uid } = req.params;
      const data = await User.findById(uid);
      const isAdmin = data.role === "admin";
      if (!isAdmin) return res.status(401).json({ error: "Unauthorized" });
      const allUser = await User.find({ email: { $ne: data.email } });
      res.status(200).json({ dataList: allUser, count: allUser.length });
    } catch (error) {
      res.status(500).json({ error });
      console.log(error);
    }
  },
  updateUserInfo: async (req, res) => {
    try {
      const userId = req.params.uid; // Assuming user ID is stored in req.user.id

      // Extract fields from request body
      const { username, age, country } = req.body;

      // Build dynamic update object
      const updateFields = {};
      if (username) updateFields.username = username;
      if (age) updateFields.age = age;
      if (country) updateFields.country = country;

      if (Object.keys(updateFields).length === 0) {
        return res
          .status(400)
          .json({ message: "No fields provided for update" });
      }

      // Perform the update
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        {
          new: true,
          runValidators: true,
          select:
            "username age country email role createdAt isVerified profileImage",
        } // Return updated user
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default userFn;
