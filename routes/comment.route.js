import { Router } from "express";
import comment from "../controllers/comment.controller.js";
import jwtFn from "../middleware/inti_jwt.js";

const commentRouter = Router();

commentRouter.get("/get-all-comment/:pid", comment.getAllComment);

commentRouter.post("/post-comment/:pid", jwtFn.verify_Jwt, comment.postComment);

commentRouter.delete(
  "/delete-comment/:cid",
  jwtFn.verify_Jwt,
  comment.deleteComment
);

export default commentRouter;
