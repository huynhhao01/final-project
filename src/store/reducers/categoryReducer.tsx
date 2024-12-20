import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Types for Category
interface Category {
  idCategory: number;
  name: string;
}

interface CategoryState {
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial State
const initialState: CategoryState = {
  categories: [],
  status: 'idle',
  error: null,
};

// Async Thunks using fetch instead of axios

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await fetch('/categories');
    const data = await response.json();
    return data;
  }
);

export const editCategoryThunk = createAsyncThunk(
  'categories/editCategory',
  async (category: { idCategory: number; name: string }) => {
    const response = await fetch(`/categories/${category.idCategory}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    const data = await response.json();
    return data;
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  'categories/deleteCategory',
  async (idCategory: number) => {
    await fetch(`/categories/${idCategory}`, {
      method: 'DELETE',
    });
    return idCategory;
  }
);

export const addCategoryThunk = createAsyncThunk(
  'categories/addCategory',
  async (category: { name: string }) => {
    const response = await fetch('/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    const data = await response.json();
    return data;
  }
);

// Slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(editCategoryThunk.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category.idCategory === action.payload.idCategory
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category.idCategory !== action.payload
        );
      })
      .addCase(addCategoryThunk.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      });
  },
});

export default categorySlice.reducer;
