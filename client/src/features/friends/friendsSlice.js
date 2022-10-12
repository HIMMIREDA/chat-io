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
      state.friends.lastMessage = action.payload;
    }
  },

  extraReducers: (builder) => {},
});

export const { reset, getFriends } = friendsSlice.actions;

export default friendsSlice.reducer;
