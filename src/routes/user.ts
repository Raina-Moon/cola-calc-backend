import { PrismaClient } from "@prisma/client";
import express, { Request, RequestHandler, Response } from "express";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", (async (req: Request, res: Response) => {
  const { name, weight, notificationEnabled = true } = req.body;

  if (!name || !weight) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      weight,
      lastActiveAt: new Date(),
      notificationEnabled,
    },
  });

  res.status(201).json(user);
}) as RequestHandler);

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, weight } = req.body;

  const updated = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name }),
      ...(weight && { weight }),
    },
  });

  res.json(updated);
});

router.patch("/:id/active", async (req, res) => {
  const { id } = req.params;
  try {
    const actived = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        lastActiveAt: new Date(),
      },
    });
    res.json(actived);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.patch("/:id/notification", async (req, res) => {
  const { id } = req.params;
  const { notificationEnabled } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        notificationEnabled: notificationEnabled,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;
