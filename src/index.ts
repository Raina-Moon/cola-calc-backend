import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import colaRoutes from "./routes/cola";
import authRoutes from "./routes/auth";
import notificationRoutes from "./routes/notification";
import { notifyActiveUser } from "./cron/notifyActiveUser";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/cola", colaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notification", notificationRoutes);

notifyActiveUser();

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is running on port ${PORT}`)
);
