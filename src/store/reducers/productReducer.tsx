import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../constants";

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    try {
      const productResponse = await fetch(`${BASE_URL}/products`); // Fixed URL concatenation
      if (!productResponse.ok) {
        throw new Error("Failed to fetch products");
      }
      const productData = await productResponse.json();
      console.log("Fetched Products:", productData); // Log the fetched data
      return { productData }; // Return product data
    } catch (error) {
      console.error("Error fetching products:", error); // Log errors if fetch fails
      // return { error: error.message }; // Return error message if fetch fails
    }
  }
);

// Async thunk to update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (updatedProduct: any) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });      
      
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      const updatedProductData = await response.json();
      console.log("Updated Product:", updatedProductData);
      return updatedProductData; // Return updated product data
    } catch (error) {
      console.error("Error updating product:", error);
      throw error; // Throw error if update fails
    }
  }
);

interface ProductState {
  products: Array<{
    id: string;
    name: string;
    available: number;
    sold: number;
    category: string;
    colorIds: number[];
    price: string;
  }>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Handle fetchProducts actions
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading"; // Set status to loading when the request is pending
      })
      .addCase(fetchProducts.fulfilled, (state, action: any) => {
        console.log("Action on fulfilled:", action); // Log action to check payload
        if (action.payload.productData) {
          state.products = action.payload.productData; // Store products on successful fetch
          state.status = "succeeded"; // Mark status as succeeded
        } else if (action.payload.error) {
          state.error = action.payload.error; // Store error message if there's an issue
          state.status = "failed"; // Mark status as failed
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.log("Error in rejected case:", action.error.message); // Log the error message
        state.status = "failed"; // Mark status as failed
        // state.error = action.error.message; // Store error message in state
      })
      // Handle updateProduct actions
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading"; // Set status to loading when the update request is pending
      })
      .addCase(updateProduct.fulfilled, (state, action: any) => {
        console.log("Action on fulfilled:", action); // Log the action payload
        // Find the index of the updated product and replace it
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload; // Replace the product in the array
          state.status = "succeeded"; // Mark status as succeeded
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        console.log("Error in rejected case:", action.error.message); // Log the error message
        state.status = "failed"; // Mark status as failed
        // state.error = action.error.message; // Store error message in state
      });
  },
});

export default productSlice.reducer;
