import "express-async-errors";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import passport from "passport";
import { connectDB } from "./config,/db.js";
import { initGoogleStrategy } from "./controllers/Google.controller.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// Initialize passport strategies
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

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
