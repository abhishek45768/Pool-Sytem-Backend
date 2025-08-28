import express from "express";
import { createPoll, endPoll, getResults,getAllPolls,autoEndExpiredPolls,clearall } from "../controllers/pollController.js";

const router = express.Router();

router.post("/", createPoll);       // Teacher creates poll
router.post("/:id/end", endPoll);   // Teacher ends poll
router.get("/:id", getResults);     // Get poll results
router.get('/',getAllPolls);
router.post("/auto-end", autoEndExpiredPolls);  // ✅ Auto-end expired polls
router.post("/clearall",clearall)
export default router;
