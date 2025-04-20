import { Router } from "express";
import post from "../controllers/post.controller.js";
import jwtFn from "../middleware/inti_jwt.js";

const postRouter = Router();

postRouter.get("/get-posts", post.getAllPost);
postRouter.get("/get-posts/:uid", jwtFn.verify_Jwt, post.getUserPosts);

postRouter.post("/create/:uid", jwtFn.verify_Jwt, post.createPost);
postRouter.delete("/delete-post/:pid", jwtFn.verify_Jwt, post.deletePost);
postRouter.get("/get-post/:postId", post.getPost);

postRouter.post(
  "/posts/:postId/toggle-like",
  jwtFn.verify_Jwt,
  post.postLikeUnlike
);

export default postRouter;
