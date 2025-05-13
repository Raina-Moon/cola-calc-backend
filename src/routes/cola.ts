import { PrismaClient } from "@prisma/client";
import express, { Request, RequestHandler, Response } from "express";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/daily", verifyToken, (async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { date, type } = req.body;

  if (!userId || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const startDate = new Date(date as string);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  try {
    const colas = await prisma.cola.findMany({
      where: {
        userId: Number(userId),
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
        ...(type && { type: type }),
      },
    });

    const totalAmount = colas.reduce((acc, cur) => acc + cur.amount, 0);
    res.json({ date, totalMl: totalAmount, entries: colas });
  } catch (err) {
    res.status(500).json({ message: "Error fetching colas" });
  }
}) as RequestHandler);

router.get("/monthly", verifyToken, (async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { year, month, type } = req.body;
  if (!userId || !year || !month || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const startDate = new Date(Number(year), Number(month) - 1, 1);
  const endDate = new Date(Number(year), Number(month), 1);
  try {
    const colas = await prisma.cola.findMany({
      where: {
        userId: Number(userId),
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
        ...(type && { type: type }),
      },
    });

    const totalAmount = colas.reduce((acc, cur) => acc + cur.amount, 0);
    res.json({
      year: Number(year),
      month: Number(month),
      type,
      totalMl: totalAmount,
      entries: colas,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching colas" });
  }
}) as RequestHandler);

router.get("yearly", (async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { year, type } = req.body;

  if (!userId || !year || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const startDate = new Date(Number(year), 0, 1);
  const endDate = new Date(Number(year) + 1, 0, 1);

  try {
    const colas = await prisma.cola.findMany({
      where: {
        userId: Number(userId),
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
        ...(type && { type: type }),
      },
    });

    const totalAmount = colas.reduce((acc, cur) => acc + cur.amount, 0);
    res.json({
      year: Number(year),
      type,
      totalMl: totalAmount,
      entries: colas,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching colas" });
  }
}) as RequestHandler);

router.post("/", (async (req: Request, res: Response) => {
  const { userId, amount, type } = req.body;

  if (!userId || !amount || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!["ORIGINAL", "ZERO"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  try {
    const cola = await prisma.cola.create({
      data: {
        amount,
        type,
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json(cola);
  } catch (err) {
    res.status(500).json({ message: "Error creating cola" });
  }
}) as RequestHandler);

export default router;
