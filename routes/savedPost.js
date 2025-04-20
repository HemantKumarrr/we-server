import { Router } from "express";
import mySavedPost from "../controllers/savedPost.controller.js";
import jwtFn from "../middleware/inti_jwt.js";

const savedPostRouter = Router();

savedPostRouter.get(
  "/saved-posts/:userId",
  jwtFn.verify_Jwt,
  mySavedPost.getSavedPosts
);
savedPostRouter.post("/saved-posts", jwtFn.verify_Jwt, mySavedPost.savePost);
savedPostRouter.delete(
  "/saved-posts/:postId",
  jwtFn.verify_Jwt,
  mySavedPost.unsavePost
);

export default savedPostRouter;
