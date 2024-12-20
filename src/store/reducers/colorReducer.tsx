import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../constants";

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

// Define the base URL for your API

// Async action to fetch colors from an API
export const fetchColors = createAsyncThunk("color/fetchColors", async () => {
  const response = await fetch(`${BASE_URL}/colors`);
  const data = await response.json();
  return data; // Return the data from the API
});

// Async action to create a new color
export const createColor = createAsyncThunk(
  "color/createColor",
  async (newColor: { name: string }) => {
    const response = await fetch(`${BASE_URL}/colors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newColor),
    });

    if (!response.ok) {
      throw new Error("Failed to create color");
    }

    const data = await response.json();
    return data; // Return the newly created color
  }
);

// Slice definition
const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch colors
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
      })

      // Create a new color
      .addCase(createColor.pending, (state) => {
        state.status = "loading"; // Set loading status when creating a color
      })
      .addCase(createColor.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.color.push(action.payload); // Add the newly created color to the state
        state.error = null;
      })
      .addCase(createColor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create color"; // Handle error
      });
  },
});

// Reducer export
export default colorSlice.reducer;
