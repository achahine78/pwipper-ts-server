import { prisma } from "../db/prisma";
import jwt, { Secret } from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../types/User";

export const createPweep = async (req: Request, res: Response) => {
  const bearer = req.headers.authorization!;
  const [, token] = bearer.split(" ");
  const user = jwt.verify(token, process.env.JWT_SECRET as Secret) as User;
  const id = user.id!;

  if (!req.body.content) {
    res.status(422);
    res.json({ message: "Content field is missing." });
    return;
  }

  try {
    const pweep = await prisma.pweep.create({
      data: {
        content: req.body.content,
        userId: id,
      },
    });

    res.json({ pweep });
  } catch (e) {
    res.status(500);
    res.json({
      message: "Internal server error",
    });
    return;
  }
};

export const getPweep = async (req: Request, res: Response) => {
  if (!req.params.id) {
    res.status(422);
    res.json({ message: "id field is missing." });
    return;
  }

  try {
    const pweep = await prisma.pweep.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!pweep) {
      res.status(404);
      res.json({
        message: "Pweep not found",
      });
      return;
    }

    res.json({ pweep });
    return;
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({
      message: "Internal server error",
    });
    return;
  }
};


export const getPweepsByUserId = async (req: Request, res: Response) => {
    if (!req.params.userId) {
      res.status(422);
      res.json({ message: "User ID field is missing." });
      return;
    }
  
    try {
      const pweeps = await prisma.pweep.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        where: {
          userId: req.params.userId,
        },
      });
  
      if (!pweeps) {
        res.status(404);
        res.json({
          message: "Pweeps not found",
        });
        return;
      }
  
      res.json({ pweeps });
      return;
    } catch (e) {
      console.log(e);
      res.status(500);
      res.json({
        message: "Internal server error",
      });
      return;
    }
  };