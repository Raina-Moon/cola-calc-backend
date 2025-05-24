import { PrismaClient } from "@prisma/client";
import express, { Request, RequestHandler, Response } from "express";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", (async (req: Request, res: Response) => {
  console.log("🧾 RAW req.body:", req.body);
  console.log(
    "🧾 typeof body fields:",
    typeof req.body.name,
    typeof req.body.weight
  );

  const { name, weight, notificationEnabled = true } = req.body;

  const parsedWeight = Number(weight);

  if (typeof name !== "string" || isNaN(parsedWeight) || parsedWeight <= 0) {
    console.log("400: Missing or invalid fields", { name, weight });
    return res.status(400).json({ message: "Missing or invalid fields" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      weight: parsedWeight,
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

router.delete("/:id", verifyToken, (async (req: Request, res: Response) => {
  const { id } = req.params;
  const userFromToken = (req as any).user.userId;

  if (userFromToken !== Number(id)) {
    return res
      .status(403)
      .json({ message: "You can only delete your own account" });
  }
  try {
    await prisma.$transaction([
      prisma.cola.deleteMany({ where: { userId: Number(id) } }),
      prisma.notification.deleteMany({ where: { userId: Number(id) } }),
      prisma.user.delete({ where: { id: Number(id) } }),
    ]);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
}) as RequestHandler);

export default router;
