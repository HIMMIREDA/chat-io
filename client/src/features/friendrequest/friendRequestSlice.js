import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import friendRequestService from "./friendRequestService";

export const fetchFriendRequests = createAsyncThunk(
  "friendRequest/fetch",
  async ({ axiosPrivate, abortController }, thunkAPI) => {
    const { accessToken: token } = thunkAPI.getState().auth.user;

    try {
      const data = await friendRequestService.fetchFriendRequests(
        axiosPrivate,
        abortController,
        token
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

export const sendRequest = createAsyncThunk(
  "friendRequest/send",
  async ({ axiosPrivate, friendId }, thunkAPI) => {
    const { accessToken: token } = thunkAPI.getState().auth.user;

    try {
      const data = await friendRequestService.sendRequest(
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

export const deleteRequest = createAsyncThunk(
  "friendRequest/delete",
  async ({ axiosPrivate, requestId }, thunkAPI) => {
    const { accessToken: token } = thunkAPI.getState().auth.user;

    try {
      const data = await friendRequestService.deleteRequest(
        axiosPrivate,
        token,
        requestId
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

export const acceptRequest = createAsyncThunk(
  "friendRequest/accept",
  async ({ axiosPrivate, requestId }, thunkAPI) => {
    const { accessToken: token } = thunkAPI.getState().auth.user;

    try {
      const data = await friendRequestService.acceptRequest(
        axiosPrivate,
        token,
        requestId
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
  friendRequests: null,
  isSuccess: false,
  isError: false,
  message: "",
  isLoading: false,
};

const friendRequestSlice = createSlice({
  name: "friendRequest",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendRequests.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.friendRequests = action.payload;
      })
      .addCase(deleteRequest.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(deleteRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.friendRequests = state.friendRequests.filter(
          (friendRequest) => friendRequest.id !== action.payload?.id
        );
      })
      .addCase(sendRequest.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(sendRequest.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(acceptRequest.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.friendRequests = state.friendRequests.filter(
          (friendRequest) => friendRequest.id !== action.payload?.id
        );
      });
  },
});

export const { reset } = friendRequestSlice.actions;

export default friendRequestSlice.reducer;
