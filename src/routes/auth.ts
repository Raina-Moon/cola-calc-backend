import express, { Request, RequestHandler, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();
dotenv.config();

router.post("/login", (async (req: Request, res: Response) => {
  const { name, birthday } = req.body;

  if (!name || !birthday) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await prisma.user.findFirst({
    where: {
      name,
      birthday,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  const refreshtoken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.json({ accessToken, refreshtoken, user });
}) as RequestHandler);

router.post("/refresh", (async (req: Request, res: Response) => {
  const { refreshtoken } = req.body;
  if (!refreshtoken) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      refreshtoken,
      process.env.JWT_SECRET as string
    ) as { userId: number };
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}) as RequestHandler);

export default router;
