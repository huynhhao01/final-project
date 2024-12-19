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

// Async action to fetch categories from an API (for example)
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await fetch("/categories"); // Adjust to your API
    const data = await response.json();
    return data; // Return data that contains categories
  }
);

// Async action to fetch objects for a specific category (e.g., based on idCategory)
export const fetchCategoryObjects = createAsyncThunk(
  "categories/fetchCategoryObjects",
  async (idCategory: number) => {
    const response = await fetch(`/categories/${idCategory}/objects`);
    const data = await response.json();
    return { idCategory, objects: data }; // Return objects for a specific category
  }
);

// Slice definition
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addObjectToCategory: (
      state,
      action: { payload: { idCategory: number; objectId: number } }
    ) => {
      const { idCategory, objectId } = action.payload;
      const category = state.categories.find(
        (cat) => cat.idCategory === idCategory
      );
      if (category) {
        category.objectIdCategory.push(objectId); // Add object to category
      }
    },
    removeObjectFromCategory: (
      state,
      action: { payload: { idCategory: number; objectId: number } }
    ) => {
      const { idCategory, objectId } = action.payload;
      const category = state.categories.find(
        (cat) => cat.idCategory === idCategory
      );
      if (category) {
        category.objectIdCategory = category.objectIdCategory.filter(
          (id) => id !== objectId
        ); // Remove object from category
      }
    },
  },
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
      // Fetch objects for a specific category
      .addCase(fetchCategoryObjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoryObjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        const category = state.categories.find(
          (cat) => cat.idCategory === action.payload.idCategory
        );
        if (category) {
          category.objectIdCategory = action.payload.objects; // Add objects to category
        }
      })
      .addCase(fetchCategoryObjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch objects for category";
      });
  },
});

// Reducer export
export default categorySlice.reducer;

// Actions export
export const { addObjectToCategory, removeObjectFromCategory } = categorySlice.actions;
