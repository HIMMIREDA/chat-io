import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
  user: null,
  loading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      const data = await authService.registerUser(user);
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

export const loginUser = createAsyncThunk(
  "auth/login",
  async (user, thunkAPI) => {
    try {
      const data = await authService.loginUser(user);
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

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await authService.logoutUser();
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
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    setAccessToken: (state, action) => {
      state.user.accessToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isError = false;
        state.loading = true;
        state.user = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isSuccess = false;
        state.isError = true;
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isSuccess = true;
        state.isError = false;
        state.loading = false;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isError = false;
        state.loading = false;
        state.user = action.payload;
      });
  },
});

export const { reset, setAccessToken, setUser } = authSlice.actions;

export default authSlice.reducer;
