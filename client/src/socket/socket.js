import { io } from "socket.io-client";

export const connectSocket = (token) => {
  return io(process.env.REACT_APP_WS_URL || "ws://localhost:5000", {
    transports: ["websocket"],
    auth: { token },
  });
};
