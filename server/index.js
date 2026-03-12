import "express-async-errors";
import "./config,/Env.js";
import authRoutes from "./routes/auth.routes.js";
import callRoutes from "./routes/Call.routes.js";
import settingsRoutes from "./routes/Setting.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import passport from "passport";
import scorecardRoutes from "./routes/Scorecard.routes.js";
import { connectDB } from "./config,/db.js";
import { initGoogleStrategy } from "./controllers/Google.controller.js";
import { errorHandler } from "./middleware/errorHandler.js";

initGoogleStrategy();

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/scorecards", scorecardRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/settings", settingsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});