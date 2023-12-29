import { Router } from "express";
import { createPweep, getPweep, getPweepsByUserId } from "./handlers/pweep";

const router = Router();

router.get("/pweep/:id", getPweep);
router.get("/pweeps/:userId", getPweepsByUserId);
router.post("/pweep", createPweep);

export default router;