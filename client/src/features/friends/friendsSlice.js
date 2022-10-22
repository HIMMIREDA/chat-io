import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import friendsService from "./friendsService";

export const deleteFriend = createAsyncThunk(
  "friends/delete",
  async ({ axiosPrivate, friendId }, thunkAPI) => {
    const { accessToken: token } = thunkAPI.getState().auth.user;

    try {
      const data = await friendsService.deleteFriend(
        axiosPrivate,
        token,
        friendId
      );
      return data;
    } catch (error) {
      let message = "";
      if (error.name !== "CanceledError") {
        message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

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
      .addCase("auth/logout/fulfilled", (state) => {
        return initialState;
      })
      .addCase(deleteFriend.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(deleteFriend.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteFriend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.friends = state.friends.filter(
          (friend) => friend.id !== action.payload.id
        );
      });
  },
});

export const { reset, getFriends } = friendsSlice.actions;

export default friendsSlice.reducer;
