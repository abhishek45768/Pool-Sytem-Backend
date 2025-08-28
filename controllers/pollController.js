import Poll from "../models/Poll.js";
import Participant from "../models/Participant.js";
// Teacher creates a poll
export const createPoll = async (req, res) => {
  try {
    const { question, options, timeLimit } = req.body;

    const poll = await Poll.create({
      question,
  options: options.map((opt) => ({ text: opt.text })),
      timeLimit,
    });

    req.io.emit("newPoll", poll);
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// End a poll
export const endPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    poll.isActive = false;
    await poll.save();

    req.io.emit("pollEnded", poll);
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get poll results
export const getResults = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all polls
// Get all polls
export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 }); // latest first
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Auto-end polls whose time has expired
export const autoEndExpiredPolls = async (req, res) => {
  try {
    const now = new Date();

    const expiredPolls = await Poll.find({
      isActive: true,
      createdAt: { $lte: new Date(now.getTime() - 1000 * 60 * 60 * 24) } // Optional: to filter old polls
    });

    const endedPolls = [];

    for (const poll of expiredPolls) {
      const pollEndTime = new Date(poll.createdAt.getTime() + poll.timeLimit * 1000);
      if (now >= pollEndTime) {
        poll.isActive = false;
        await poll.save();
        endedPolls.push(poll);
        req.io.emit("pollEnded", poll); // Notify clients via socket
      }
    }

    res.json({
      message: `${endedPolls.length} poll(s) ended.`,
      polls: endedPolls,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const clearall = async (req, res) => {
  try {
    await Poll.deleteMany({});
    await Participant.deleteMany({});
    res.status(200).json({ message: "All polls and participants have been deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
