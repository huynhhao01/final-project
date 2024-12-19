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
    }
  }
);

// Async thunk to update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (updatedProduct: any) => {
    try {
      const response = await fetch(
        `${BASE_URL}/products/${updatedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

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

// Async thunk to create a new product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (newProduct: any) => {
    try {
      const response = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const createdProduct = await response.json();
      console.log("Created Product:", createdProduct);
      return createdProduct; // Return created product data
    } catch (error) {
      console.error("Error creating product:", error);
      throw error; // Throw error if create fails
    }
  }
);

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      return productId; // Return the product ID after successful deletion
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error; // Throw error if deletion fails
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
        if (action.payload.productData) {
          state.products = action.payload.productData; // Store products on successful fetch
          state.status = "succeeded"; // Mark status as succeeded
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed"; // Mark status as failed if there's an error
      })
      // Handle updateProduct actions
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading"; // Set status to loading when the update request is pending
      })
      .addCase(updateProduct.fulfilled, (state, action: any) => {
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload; // Replace the product in the array
          state.status = "succeeded"; // Mark status as succeeded
        }
      })
      // Handle deleteProduct actions
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading"; // Set status to loading when the delete request is pending
      })
      .addCase(deleteProduct.fulfilled, (state, action: any) => {
        // Remove the product from the array based on the product ID
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
        state.status = "succeeded"; // Mark status as succeeded
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed"; // Mark status as failed if there's an error
      })
      // Handle other actions (createProduct, etc.)
  },
});

export default productSlice.reducer;
