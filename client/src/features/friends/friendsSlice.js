import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  friends: null,
  isSuccess: false,
  isError: false,
  isLoading: false,
  message: "",
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    getFriends: (state, action) => {
      state.friends = action.payload;
    },
    updateConnectedStatus: (state, action) => {
      state.friends = state.friends.map((friend) =>
        friend.id === action.payload.userId
          ? { ...friend, connected: action.payload.connected }
          : friend
      );
    },
    updateLastMessage: (state, action) => {
      state.friends = state.friends.map((friend) =>
        action.payload.from.username === friend.username ||
        action.payload.to.username === friend.username
          ? {
              ...friend,
              lastMessage: {
                ...action.payload,
                from: action.payload.from._id,
                to: action.payload.to._id,
              },
            }
          : friend
      );
    },
  },

  extraReducers: (builder) => {
    builder
    .addCase("auth/logout/fulfilled",(state) => {
      return initialState;
    })
  },
});

export const { reset, getFriends } = friendsSlice.actions;

export default friendsSlice.reducer;