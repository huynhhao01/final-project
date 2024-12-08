import { createSlice } from "@reduxjs/toolkit";
export const LOGIN = "LOGIN";

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
