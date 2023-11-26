import { Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../types/User";

export const createJWT = (user: User) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET as Secret
  );
  return token;
};

export const protect = (req: Request, res: Response, next: () => void) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: "Not authorized" });
    return;
  }

  const [, token] = bearer.split(" ");
  if (!token) {
    res.status(401);
    res.json({ message: "Not authorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as Secret);
    (req as Request & { user: string | JwtPayload }).user = payload;
    next();
    return;
  } catch (e) {
    res.status(401);
    res.json({ message: "Not authorized" });
    return;
  }
};

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5);
};
