import "dotenv/config";
import express from "express";
import authRoutes from "./modules/auth/routes.js";
import repoRouter from "./modules/repos/route.js";
import cookieParser from "cookie-parser";


const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/repos",repoRouter);

app.listen(4000, () => console.log("http-server running on :4000"));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});