import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import userRoute from "./routes/user.routes.js";
import companyRoute from "./routes/company.routes.js";
import jobRoute from "./routes/job.routes.js";
import applicationtRoute from "./routes/application.routes.js";

dotenv.config();

const app = express();
connectDb();
app.use(
  cors({
    origin: `${process.env.ORIGIN_URL}`,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend is Up and Running");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationtRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is up and running!" });
});

export default app;
