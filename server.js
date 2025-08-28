import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import pollRoutes from "./routes/pollRoutes.js";
import ParticipantRoutes from './routes/participantRoutes.js'
import pollSocket from "./socket/pollSocket.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// middleware
app.use(cors());
app.use(express.json());

// inject io into req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// routes
app.use("/api/polls", pollRoutes);
app.get("/",(req,res)=>{
  res.send("Api Runing ")
})
app.use("/api", ParticipantRoutes);
// socket setup
pollSocket(io);

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
