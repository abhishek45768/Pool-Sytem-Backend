import Poll from "../models/Poll.js";

export default function pollSocket(io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Student joins
    socket.on("joinStudent", (name) => {
      io.emit("studentJoined", { name, id: socket.id });
    });

    // Student votes
    socket.on("submitVote", async ({ pollId, optionId }) => {
      const poll = await Poll.findById(pollId);
      if (!poll || !poll.isActive) return;

      const option = poll.options.id(optionId);
      option.votes += 1;
      poll.totalVotes += 1;
      await poll.save();

      io.emit("voteUpdate", poll);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      io.emit("studentLeft", socket.id);
    });
  });
}
