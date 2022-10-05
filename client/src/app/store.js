import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import friendsReducer from "../features/friends/friendsSlice";
import { connectSocket } from "../socket/socket";

const createMySocketMiddleware = (store) => (next) => (action) => {
  let socket;
  if (action.type === "socket/connect" && !socket) {
    socket = connectSocket(store.getState().auth.user?.accessToken);
    socket.on("friends", (friends) => {
      console.log(friends);
      next({ type: "friends/getFriends", payload: friends });
    });
    socket.on("private-message", (message) => {
      console.log(message);
    });

    socket.on("user disconnected", (userId) => {
      console.log(`User with id ${userId} has been disconnected`);
      next({ type: "friends/updateConnectedStatus", payload: { userId, connected: false } });
    });
    socket.on("user connected", (userId) => {
      console.log(`User with id ${userId} has been connected`);
      next({ type: "friends/updateConnectedStatus", payload: { userId, connected: true } });
    });
  }

  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    createMySocketMiddleware,
  ],
});
