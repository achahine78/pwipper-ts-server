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
    res.json({
      token,
      id: user.id,
      username: user.username,
      handle: user.handle,
      image: user.image,
      bio: user.bio,
    });
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
  res.json({
    token,
    id: user.id,
    username: user.username,
    handle: user.handle,
    image: user.image,
    bio: user.bio,
  });
};

export const getUserByHandle = async (req: Request, res: Response) => {
  if (!req.params.handle) {
    res.status(422);
    res.json({ message: "Username field is missing." });
    return;
  }

  const handle = req.params.handle;

  const user = await prisma.user.findUnique({
    where: {
      handle: handle,
    },
  });

  if (!user) {
    res.status(401);
    res.json({
      message: "User not found",
    });
    return;
  }

  res.json({
    id: user.id,
    username: user.username,
    handle: user.handle,
    image: user.image,
    bio: user.bio,
  });
};

export const follow = async (req: Request, res: Response) => {
  if (!req.body.followedBy) {
    res.status(422);
    res.json({ message: "Followed by field is missing." });
    return;
  }

  if (!req.body.following) {
    res.status(422);
    res.json({ message: "Following field is missing." });
    return;
  }

  try {
    const createFollow = await prisma.follows.create({
      data: {
        followedById: req.body.followedBy,
        followingId: req.body.following,
      },
    });
  } catch (e) {
    res.status(500);
    res.json({
      message: "Internal server error",
    });
    return;
  }

  res.sendStatus(200);
};

export const unfollow = async (req: Request, res: Response) => {
  if (!req.body.followedBy) {
    res.status(422);
    res.json({ message: "Followed by field is missing." });
    return;
  }

  if (!req.body.following) {
    res.status(422);
    res.json({ message: "Following field is missing." });
    return;
  }

  try {
    await prisma.follows.delete({
      where: {
        followingId_followedById: {
          followedById: req.body.followedBy,
          followingId: req.body.following,
        }
      },
    });
  } catch (e) {
    res.status(500);
    res.json({
      message: "Internal server error",
    });
    return;
  }

  res.sendStatus(200);
};
