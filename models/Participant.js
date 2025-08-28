import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  hasVoted: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: true },
});

export default mongoose.model("Participant", participantSchema);
