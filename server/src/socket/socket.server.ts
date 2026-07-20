import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { authenticateSocket } from "./socket.auth.js";
import ApiError from "../utils/ApiError.js";

let io: Server;

export const initializeSocket = (httpServer: HttpServer) => {
  console.log("Socket Server Initialized")
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const user = await authenticateSocket(socket);

      socket.data.user = user;

      next();
    } catch (err) {
      next(new ApiError(404,"Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;

    console.log(`✅ ${user.name} connected (${socket.id})`);

    socket.join(`tenant:${user.tenantId}`);

    console.log(`Joined room tenant:${user.tenantId}`);

    socket.on("disconnect", () => {
      console.log(`${user.name} disconnected`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};
