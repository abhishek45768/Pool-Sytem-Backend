import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [optionSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  timeLimit: { type: Number, default: 60 }, // seconds
  totalVotes: { type: Number, default: 0 },
});

export default mongoose.model("Poll", pollSchema);
