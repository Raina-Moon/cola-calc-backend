import express, { Request, RequestHandler, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();
dotenv.config();

router.get("/login", (async (req: Request, res: Response) => {
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

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
}) as RequestHandler);

export default router;
