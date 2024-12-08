import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../constants";
export const LOGIN = "LOGIN";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const userResponse = await fetch(BASE_URL + "/auth");

  if (userResponse.status === 200) {
    const userData = await userResponse.json();
    console.log(userData);

    return {
      error: false,
      users: userData,
    };
  }
  return {
    error: true,
  };
});

// const initialState = {

// }
const auth = createSlice({
  name: "auth",
  initialState: {
    email: "",
    password: "",
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(LOGIN, (state, action: any) => {
      state.email = action.email;
      state.password = action.password;
      state.isLoggedIn = true;
    });
  },
});

const authReducer = auth.reducer;
export default authReducer;
