// authReducer.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: { email: string; name: string } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isLoggedIn: boolean;
}

// Async action for login
export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    // Fetch user data from the /auth endpoint in db.json
    const response = await fetch("/auth");
    const data = await response.json();

    // Check if email and password match
    if (data.email === email && data.password === password) {
      return { error: false, userData: data }; // Successful login
    } else {
      return { error: true, message: "Invalid credentials" }; // Invalid credentials
    }
  }
);

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  isLoggedIn: false,
};

// Slice definition for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.isLoggedIn = false; // Set to false on logout
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        if (!action.payload.error) {
          state.status = "succeeded";
          state.user = action.payload.userData;
          state.error = null;
          state.isLoggedIn = true;
        } else {
          state.status = "failed";
          state.error =
            action.payload.message || "Login failed, please try again.";
          // state.isLoggedIn = false;
        }
      })
      .addCase(loginAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
        // state.isLoggedIn = false;
      });
  },
});

export default authSlice.reducer;
