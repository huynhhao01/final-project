import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../store/reducers/categoryReducer"; // Adjust path
import { fetchColors } from "../store/reducers/colorReducer"; // Adjust path
import { updateProduct } from "../store/reducers/productReducer"; // Correct import
import { AppDispatch } from "../store"; // Ensure AppDispatch is imported
import ProductForm from "../components/ProductForm"; // Reusable form component

export default function EditProductPage() {
  const dispatch = useDispatch<AppDispatch>(); // Type dispatch properly
  const navigate = useNavigate();

  const { categories } = useSelector((state: any) => state.categories);
  const { color } = useSelector((state: any) => state.color);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    available: 0,
    sold: 0,
    categoryId: "",
    price: 0,
    colorIds: [],
  });

  useEffect(() => {
    // Fetch categories and colors on page load
    dispatch(fetchCategories());
    dispatch(fetchColors());
  }, [dispatch]);

  // Handle save logic
  const handleSave = () => {
    dispatch(updateProduct(formData));
    navigate("/products"); // Redirect to the product list page after saving
  };

  return (
    <Container>
      <Box sx={{ padding: 3 }}>
        <h2>Edit Product</h2>
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          colorOptions={color}
          onSave={handleSave}
        />
      </Box>
    </Container>
  );
}

// Add this line at the end of the file
export {}; // This ensures the file is treated as a module
