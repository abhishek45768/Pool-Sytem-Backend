import express from "express";
import { joinParticipant, leaveParticipant ,votePoll,getParticipants,kickParticipant, getParticipantById} from "../controllers/participantController.js";

const router = express.Router();

router.post("/join", joinParticipant);   // Student joins
router.post("/leave", leaveParticipant); // Student leaves
router.post("/polls/:id/vote", votePoll);
router.get("/participants", getParticipants);
router.post("/participants/kick", kickParticipant);
router.get("/participants/:id", getParticipantById);

export default router;
