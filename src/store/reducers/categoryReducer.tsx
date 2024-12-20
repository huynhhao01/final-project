import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// State interface
interface CategoryState {
  categories: Array<{
    idCategory: number;
    name: string;
    objectIdCategory: number[]; // Objects linked to this category
  }>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: CategoryState = {
  categories: [],
  status: "idle",
  error: null,
};

// Async action to fetch categories from an API
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await fetch("/categories"); // Adjust to your API
    const data = await response.json();
    return data; // Return data that contains categories
  }
);

// Edit category async thunk
export const editCategoryThunk = createAsyncThunk(
  "categories/editCategory",
  async (category: { idCategory: number; name: string }) => {
    const response = await fetch(`/categories/${category.idCategory}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(errorText || "Failed to update category");
    }

    const data = await response.json();
    return data; // Return the updated category
  }
);

// Delete category async thunk
export const deleteCategoryThunk = createAsyncThunk(
  "categories/deleteCategory",
  async (idCategory: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/categories/${idCategory}`, {
        method: "DELETE", // Make a DELETE request
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        return rejectWithValue(errorText || "Failed to delete category");
      }

      return idCategory; // Return the id of the deleted category
    } catch (error) {
      // return rejectWithValue(error.message || "Failed to delete category");
    }
  }
);

// Slice definition
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload; // Populate categories with fetched data
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch categories";
      })
      // Edit category
      .addCase(editCategoryThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editCategoryThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.categories.findIndex(
          (category) => category.idCategory === action.payload.idCategory
        );
        if (index !== -1) {
          state.categories[index] = action.payload; // Update category with edited data
        }
      })
      .addCase(editCategoryThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to edit category";
      })
      // Delete category
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = state.categories.filter(
          (category) => category.idCategory !== action.payload // Remove deleted category
        );
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete category";
      });
  },
});

export default categorySlice.reducer;
