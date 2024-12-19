import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// State interface
interface ColorState {
  color: Array<{ id: string; name: string }>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: ColorState = {
  color: [],
  status: "idle",
  error: null,
};

// Async action to fetch colors from an API
export const fetchColors = createAsyncThunk("color/fetchColors", async () => {
  const response = await fetch("/colors"); // Adjust to your API endpoint
  const data = await response.json();
  return data; // Return the data from the API
});

// Slice definition
const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColors.pending, (state) => {
        state.status = "loading"; // Set loading status
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.color = action.payload; // Populate color array with fetched data
        state.error = null;
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch colors"; // Handle error
      });
  },
});

// Reducer export
export default colorSlice.reducer;
