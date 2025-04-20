import { Router } from "express";
import auth from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", auth.signup);
authRouter.post("/login", auth.login);
authRouter.get("/google", auth.googleLogin);
authRouter.get("/logout", auth.logout);
authRouter.post("/forgot-password", auth.forgotPassword);
authRouter.post("/reset-password/:token", auth.resetPassword);
authRouter.post("/verify-otp", auth.verifySingup);

export default authRouter;
