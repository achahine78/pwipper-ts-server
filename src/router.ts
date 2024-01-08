import { Router } from "express";
import { createPweep, getPweep, getPweepsByUserId } from "./handlers/pweep";
import {
  follow,
  getFollowers,
  getFollowing,
  getUserByHandle,
  unfollow,
} from "./handlers/user";

const router = Router();

router.get("/pweep/:id", getPweep);
router.get("/pweeps/:userId", getPweepsByUserId);
router.post("/pweep", createPweep);

router.get("/user/:handle", getUserByHandle);

router.post("/follow", follow);
router.post("/unfollow", unfollow);
router.get("/following/:userId", getFollowing);
router.get("/followers/:userId", getFollowers);

export default router;
