import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box } from "@mui/material";
import { fetchCategories } from "../store/reducers/categoryReducer"; // Adjust path
import { fetchColors } from "../store/reducers/colorReducer"; // Adjust path
import { createProduct } from "../store/reducers/productReducer"; // Correct import
import { AppDispatch } from "../store"; // Ensure AppDispatch is imported
import ProductForm from "../components/ProductForm"; // Reusable form component

export default function AddProductPage() {
  const dispatch = useDispatch<AppDispatch>(); // Type dispatch properly
  const { categories } = useSelector((state: any) => state.categories);
  const { color } = useSelector((state: any) => state.color);

  const [formData, setFormData] = useState({
    name: "",
    available: 0,
    sold: 0,
    categoryId: "",
    price: 0,
    colorIds: [],
  });

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchColors());
  }, [dispatch]);

  const handleSave = () => {
    // Dispatch the action to create a new product
    dispatch(createProduct(formData));
  };

  return (
    <Container>
      <Box sx={{ padding: 3 }}>
        <h2>Add New Product</h2>
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
