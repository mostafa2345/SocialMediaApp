import express from "express";
import dotenv from "dotenv";
import connectDB from "./dbConfig/db.js";
import helmet from "helmet";
import morgan from "morgan";
import userRoute from "./routers/users.js";
import authRoute from "./routers/auth.js";
import postRoute from "./routers/posts.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
connectDB(MONGO_URI);

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.listen(PORT, () => {
  console.log("server is running");
});
