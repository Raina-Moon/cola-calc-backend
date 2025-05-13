import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import colaRoutes from "./routes/cola";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/cola", colaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
