import express, { urlencoded } from "express";
import { connectDB } from "../config/mongodb.js";
import cors from "cors";
import cookieParse from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "../routes/auth.route.js";
import postRouter from "../routes/post.route.js";
import commentRouter from "../routes/comment.route.js";
import userRouter from "../routes/user.route.js";
import savedPostRouter from "../routes/savedPost.js";
import errorHandlerMiddleware from "../utils/handleError.js";

const app = express();
const PORT = process.env.PORT;

// Database Conncetion
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParse());
app.use(express.json());
app.use(urlencoded({ extended: true }));

// Routes
app.use(authRouter);
app.use(postRouter);
app.use(commentRouter);
app.use(userRouter);
app.use(savedPostRouter);

app.get("/", (req, res) => {
  res.send("Working");
});

// Error Handler
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`listening at PORT: ${PORT}`);
});
