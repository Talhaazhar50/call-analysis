import "express-async-errors";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config,/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();
app.use(cookieParser())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true  // <-- this is required for cookies
}))
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
