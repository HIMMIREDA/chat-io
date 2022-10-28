import { io } from "socket.io-client";

export const connectSocket = (token) => {
  const options = {
    transports: ["websocket"],
    auth: { token },
  }
  return process.env.REACT_APP_WS_URL ? io(process.env.REACT_APP_WS_URL, options): io(options);
};
