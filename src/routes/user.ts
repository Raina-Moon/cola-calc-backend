import { PrismaClient } from "@prisma/client";
import express, { Request, RequestHandler, Response } from "express";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", (async (req: Request, res: Response) => {
  const { name, birthday, weight } = req.body;

  if (!name || !birthday || !weight) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await prisma.user.create({
    data: { name, birthday, weight },
  });

  res.status(201).json(user);
}) as RequestHandler);

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, birthday, weight } = req.body;

  const updated = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name }),
      ...(birthday && { birthday }),
      ...(weight && { weight }),
    },
  });

  res.json(updated);
});

export default router;
