import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = ((
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  console.log("Auth Header:", authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    console.log("No Bearer token found");
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
    (req as any).user = { userId: decoded.userId };
    console.log("Decoded token:", decoded);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}) as RequestHandler;
