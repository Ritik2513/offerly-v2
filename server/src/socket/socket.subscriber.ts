import redisQueueConnection from "../config/redisQueue.js";
import { getIO } from "./socket.server.js";
import { SOCKET_EVENTS } from "./events.js";

const subscriber = redisQueueConnection.duplicate();

export const initializeSubscriber = async () => {
  await subscriber.subscribe("analytics-events");

  console.log("📡 Redis Subscriber Initialized");

  subscriber.on("message", (channel, message) => {
    if (channel !== "analytics-events") return;

    const payload = JSON.parse(message);

    const io = getIO();

    switch (payload.type) {
      case "CLICK_TRACKED":
        io.to(`tenant:${payload.tenantId}`).emit(
          SOCKET_EVENTS.CLICK_TRACKED,
          payload.click,
        );

        console.log(`📤 CLICK_TRACKED emitted to tenant:${payload.tenantId}`);

        break;
    }
  });
};
