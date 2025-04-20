import { Router } from "express";
import jwtFn from "../middleware/inti_jwt.js";
import userFn from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.delete("/account-delete/:uid", jwtFn.verify_Jwt, userFn.deleteUser);
userRouter.get("/getAll-users/:uid", jwtFn.verify_Jwt, userFn.getAllUsers);
userRouter.put("/update-profile/:uid", jwtFn.verify_Jwt, userFn.updateUserInfo);

export default userRouter;
