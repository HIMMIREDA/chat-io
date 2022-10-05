import { io } from "socket.io-client";

export const connectSocket = (token) => {
  return io.connect(process.env.REACT_APP_WS_URL, {
    auth: { token },
  });
};
