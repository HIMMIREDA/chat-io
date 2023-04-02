import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import friendsReducer from "../features/friends/friendsSlice";
import conversationReducer from "../features/conversation/conversationSlice";
import friendRequestReducer from "../features/friendrequest/friendRequestSlice";
import { connectSocket } from "../socket/socket";

const createMySocketMiddleware = (store) => {
  let socket = null;
  return (next) => (action) => {
    if (action.type === "socket/connect") {
      const { token } = action.payload;
      socket = connectSocket(token);
      socket.on("private-message", (message) => {
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
        store.dispatch({
          type: "friends/updateConnectedStatus",
          payload: { userId, connected: false },
        });
      });
      socket.on("user connected", (userId) => {
        store.dispatch({
          type: "friends/updateConnectedStatus",
          payload: { userId, connected: true },
        });
      });
      socket.on("delete-friend", (friendId) => {
        store.dispatch({
          type: "friends/deleteFriendFromList",
          payload: { friendId },
        });
      });
    }
    if (action.type === "socket/sendMessage") {
      if (!socket.connected) {
        store.dispatch({
          type: "socket/connect",
          payload: { token: store.getState().auth.user.token },
        });
      }
      socket.emit("private-message", action.payload);
    }

    if (action.type === "friends/delete/fulfilled") {
      console.log("first");
      socket.emit("delete-friend", { friendId: action.payload.id });
    }

    if (action.type === "auth/logout/pending") {
      socket?.disconnect();
    }
    return next(action);
  };
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
    conversation: conversationReducer,
    friendRequest: friendRequestReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    createMySocketMiddleware,
  ],
});
