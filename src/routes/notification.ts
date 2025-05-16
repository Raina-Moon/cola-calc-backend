import { PrismaClient } from "@prisma/client";
import express from "express";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await prisma.notification.findMany({
      where: { userId: Number(id) },
      orderBy: { createdAt: "desc" },
    });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { userId, message } = req.body;

  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message: message,
      },
    });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/read/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedNotification = await prisma.notification.update({
      where: { id: Number(id) },
      data: {
        isRead: true,
      },
    });
    res.json(updatedNotification);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
