import redisSubscriber from "../config/redisSubscriber.js";
import { getIO } from "./socket.server.js";
import { SOCKET_EVENTS } from "./events.js";

export const initializeSubscriber = async () => {
    await redisSubscriber.subscribe("analytics-events");

    console.log("📡 Redis Subscriber Initialized");

    redisSubscriber.on("message", (channel, message) => {

        if (channel !== "analytics-events") return;

        const payload = JSON.parse(message);

        const io = getIO();

        io.to(`tenant:${payload.tenantId}`).emit(
            SOCKET_EVENTS.CLICK_TRACKED,
            payload
        );

        console.log("📤 Event sent to tenant:", payload.tenantId);
    });
};