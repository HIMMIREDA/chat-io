import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import conversationService from "./conversationService";

export const fetchConversation = createAsyncThunk(
  "conversation/fetch",
  async (friendId, thunkAPI) => {
    const { accessToken: token } = thunkAPI.getState().auth.user;
    const pageNum = thunkAPI.getState().conversation.nextPage;
    thunkAPI.dispatch(selectConversation(friendId));
    try {
      const data = await conversationService.fetchConversation(
        friendId,
        token,
        pageNum
      );
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  conversation: [],
  friendId: null,
  nextPage: 1,
  isError: false,
  isLoading: false,
  message: "",
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.message = "";
    },
    clearConversation: (state) => {
      state.conversation = [];
      state.friendId = null;
      state.nextPage = 1;
    },
    selectConversation: (state, action) => {
      state.friendId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchConversation.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.message = "";
    })
    .addCase(fetchConversation.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    })
    .addCase(fetchConversation.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.nextPage = action.payload.next.page || state.nextPage;
      state.conversation.push(...action.payload.data);
    })
  },
});

export const { reset, clearConversation, selectConversation} = conversationSlice.actions;

export default conversationSlice.reducer;
