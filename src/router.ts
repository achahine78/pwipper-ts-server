import { Router } from "express";
import { createPweep, getPweep, getPweepsByUserId } from "./handlers/pweep";
import { getUserByHandle } from "./handlers/user";

const router = Router();

router.get("/pweep/:id", getPweep);
router.get("/pweeps/:userId", getPweepsByUserId);
router.post("/pweep", createPweep);

router.get("/user/:handle", getUserByHandle);

export default router;