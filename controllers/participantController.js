import Participant from "../models/Participant.js";
import Poll from "../models/Poll.js";
// Student joins
export const joinParticipant = async (req, res) => {
  try {
    const { name } = req.body;

    let participant = await Participant.findOne({ name });
    if (!participant) {
      participant = await Participant.create({ name });
      req.io.emit("studentJoined", { name });
    }

    res.status(201).json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student leaves (optional)
export const leaveParticipant = async (req, res) => {
  try {
    const { name } = req.body;
    const participant = await Participant.findOne({ name });

    if (participant) {
      participant.isOnline = false;
      await participant.save();
      req.io.emit("studentLeft", { name });
    }

    res.json({ message: "Student left" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const votePoll = async (req, res) => {
  try {
    const { optionId } = req.body;
    const { id } = req.params;

    const poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const option = poll.options.id(optionId);
    if (!option) return res.status(404).json({ message: "Option not found" });

    // increment votes
    option.votes += 1;
    poll.totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
    await poll.save();

    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all participants
export const getParticipants = async (req, res) => {
  try {
    const participants = await Participant.find(); // get all participants
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kick out participant (remove from DB)
export const kickParticipant = async (req, res) => {
  try {
    const { name } = req.body;
    const participant = await Participant.findOne({ name });
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    await Participant.deleteOne({ name });

    // Notify clients about the kicked participant
    req.io.emit("studentLeft", { name });

    res.json({ message: `${name} was kicked out successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET /participants/:id
export const getParticipantById = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }
    res.json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
