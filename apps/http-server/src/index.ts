import "dotenv/config";
import express from "express";
import authRoutes from "./modules/auth/routes.js";
import repoRouter from "./modules/repos/route.js";
import cookieParser from "cookie-parser";
import userRouter from "./modules/users/route.js";
import recommendationRoutes from "./modules/recommendations/routes.js"
import issueRouter from "./modules/issues/route.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/repos", repoRouter);
app.use("/users", userRouter);
app.use("/recommendations", recommendationRoutes);
app.use("/issues", issueRouter);

app.listen(4000, () => console.log("http-server running on :4000"));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});