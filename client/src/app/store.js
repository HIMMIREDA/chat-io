import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import friendsReducer from "../features/friends/friendsSlice";
import conversationReducer from "../features/conversation/conversationSlice";
import { connectSocket } from "../socket/socket";

const createMySocketMiddleware = (store) => {
  let socket = null;
  return (next) => (action) => {
    if (action.type === "socket/connect") {
      const { token } = action.payload;
      socket = connectSocket(token);
      socket.once("friends", (friends) => {
        console.log(friends);
        console.log("refreshed");
        store.dispatch({ type: "friends/getFriends", payload: friends });
      });

      socket.on("private-message", (message) => {
        console.log("message received : " + JSON.stringify(message));
        // add message if receiver is opening the correct conversation
        if (message) {
          if (
            store.getState().conversation.friendId === message.to._id ||
            store.getState().conversation.friendId === message.from._id
          ) {
            store.dispatch({
              type: "conversation/storeMessage",
              payload: message,
            });
          }
          // update the last message on the chatbar
          store.dispatch({
            type: "friends/updateLastMessage",
            payload: message,
          });
        }
      });

      socket.on("user disconnected", (userId) => {
        console.log(`User with id ${userId} has been disconnected`);
        store.dispatch({
          type: "friends/updateConnectedStatus",
          payload: { userId, connected: false },
        });
      });
      socket.on("user connected", (userId) => {
        console.log(socket);
        console.log(`User with id ${userId} has been connected`);
        store.dispatch({
          type: "friends/updateConnectedStatus",
          payload: { userId, connected: true },
        });
      });
    }
    if (action.type === "socket/sendMessage") {
      if (!socket.connected) {
        socket.connect();
      }
      console.log("message sent : " + JSON.stringify(action.payload));
      socket.emit("private-message", action.payload);
    }

    if (action.type === "auth/logout") {
      console.log("scoket cleared");
      socket.disconnect();
    }
    return next(action);
  };
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
    conversation: conversationReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    createMySocketMiddleware,
  ],
});
