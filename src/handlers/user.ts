import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

export const createUser = async (req: Request, res: Response) => {
  if (!req.body.username) {
    res.status(422);
    res.json({ message: "Username field is missing." });
    return;
  }

  if (!req.body.password) {
    res.status(422);
    res.json({ message: "Password field is missing." });
    return;
  }

  if (!req.body.handle) {
    res.status(422);
    res.json({ message: "Handle field is missing." });
    return;
  }

  const username = req.body.username;
  const password = await hashPassword(req.body.password);
  const handle = req.body.handle;
  const image = req.body.image || "";
  const bio = req.body.bio || "";

  try {
    const user = await prisma.user.create({
      data: {
        username,
        handle,
        password,
        image,
        bio,
      },
    });

    const token = createJWT(user);
    res.json({ token });
  } catch (e) {
    res.status(409);
    res.json({ message: "Email or username are already taken." });
  }
};

export const login = async (req: Request, res: Response) => {
  if (!req.body.handle) {
    res.status(422);
    res.json({ message: "Username field is missing." });
    return;
  }

  if (!req.body.password) {
    res.status(422);
    res.json({ message: "Password field is missing." });
    return;
  }

  const handle = req.body.handle;
  const password = req.body.password;
  const user = await prisma.user.findUnique({
    where: {
      handle: handle,
    },
  });

  if (!user) {
    res.status(401);
    res.json({
      message: "Invalid username and password combination",
    });
    return;
  }

  const isValid = await comparePasswords(password, user.password);

  if (!isValid) {
    res.status(401);
    res.json({
      message: "Invalid username and password combination",
    });
    return;
  }

  const token = createJWT(user);
  res.json({ token });
};
