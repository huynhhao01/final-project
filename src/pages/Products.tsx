import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Container } from "@mui/material";
import {
  fetchProducts,
  updateProduct,
  createProduct,
  deleteProduct,
} from "../store/reducers/productReducer"; // Use createProduct instead of addProduct

import { fetchColors } from "../store/reducers/colorReducer"; // Adjust path as needed
import { fetchCategories } from "../store/reducers/categoryReducer"; // Adjust path as needed
import { AppDispatch } from "../store"; // Import RootState and AppDispatch from store

// Helper function to get color names based on colorIds
const getColorNames = (colorIds: any[], colorData: any[]) => {
  if (!Array.isArray(colorIds) || colorIds.length === 0) {
    return "No colors available";
  }

  if (!Array.isArray(colorData) || colorData.length === 0) {
    return "Color data not available";
  }

  return colorIds
    .map((colorId) => {
      const colorItem = colorData.find(
        (col: any) => String(col.id) === String(colorId)
      );
      return colorItem ? colorItem.name : "Unknown Color";
    })
    .join(", ");
};

export default function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector(
    (state: any) => state.products
  );
  const { color } = useSelector((state: any) => state.color);
  const { categories, status: categoryStatus } = useSelector(
    (state: any) => state.categories
  );

  // State to control modal visibility and selected product data
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Local state for handling form inputs
  const [formData, setFormData] = useState({
    name: "",
    available: 0,
    sold: 0,
    categoryId: "",
    price: 0,
    colorIds: [] as number[],
  });

  const normalizeProductData = (product: any) => {
    const normalizedProduct = { ...product };

    if (normalizedProduct.colorIds) {
      normalizedProduct.colorIds = normalizedProduct.colorIds.map((id: any) =>
        Number(id)
      );
    }

    return normalizedProduct;
  };

  const handleOpen = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      available: product.available,
      sold: product.sold,
      categoryId: product.categoryId, // Populate categoryId from the product
      price: product.price,
      colorIds: product.colorIds || [],
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (!formData.name || formData.available < 0 || formData.price <= 0) {
      alert("Please fill in all fields correctly");
      return;
    }

    if (selectedProduct) {
      dispatch(
        updateProduct({
          ...formData,
          colorIds: formData.colorIds,
          id: selectedProduct.id,
        })
      );
    } else {
      // Use createProduct to add a new product
      dispatch(createProduct(formData));
    }

    handleClose();
  };

  const handleSelectChange = (event: any, name: string) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Update categoryId here when the user selects a new category
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleColorChange = (event: any) => {
    const selectedColorIds = event.target.value as number[];
    const newColorIds = selectedColorIds.reduce((acc: number[], id: number) => {
      const numericId = Number(id);
      if (acc.includes(numericId)) {
        return acc.filter((colorId) => colorId !== numericId);
      } else {
        return [...acc, numericId];
      }
    }, []);

    setFormData((prevState) => ({
      ...prevState,
      colorIds: newColorIds,
    }));
  };

  const handleDelete = (productId: string) => {
    // Show a confirmation before deleting
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId)); // Dispatch delete action
    }
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
      dispatch(fetchColors());
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  // Loading states
  if (
    status === "loading" ||
    !color ||
    color.length === 0 ||
    categoryStatus === "loading" ||
    !categories ||
    categories.length === 0
  ) {
    return <div>Loading data...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  // Calculate totals
  const totalAvailable = products.reduce(
    (total: number, product: any) =>
      total +
      (isNaN(Number(product.available)) ? 0 : Number(product.available)),
    0
  );

  const totalSold = products.reduce(
    (total: number, product: any) =>
      total + (isNaN(Number(product.sold)) ? 0 : Number(product.sold)),
    0
  );

  const totalRevenue = products.reduce(
    (total: number, product: any) => total + (isNaN(Number(product.price)) ? 0 : Number(product.price)) * (isNaN(Number(product.sold)) ? 0 : Number(product.sold)),
    0
  );
  
  // Format revenue as a decimal number with comma as thousand separator
  const formattedTotalRevenue = new Intl.NumberFormat().format(Number(totalRevenue));
  

  return (
    <Container>
      {/* Display Total values */}
      <Box sx={{ marginBottom: 3 }}>
        <h3>Total: </h3>
        <p>Available: {totalAvailable}</p>
        <p>Sold: {totalSold}</p>
        <p>Revenue: ${formattedTotalRevenue}</p>
      </Box>

      {/* Add Product Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSelectedProduct(null); // Reset form for new product
          setFormData({
            name: "",
            available: 0,
            sold: 0,
            categoryId: "",
            price: 0,
            colorIds: [],
          });
          setOpen(true);
        }}
        fullWidth
        style={{ marginTop: 20 }}
      >
        Add Product
      </Button>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Sold</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product: any, index: number) => {
                const normalizedProduct = normalizeProductData(product);

                // Find the category for the product by matching categoryId
                const category = categories.find(
                  (category: any) =>
                    String(category.id) === String(normalizedProduct.categoryId)
                );

                return (
                  <TableRow key={normalizedProduct.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{normalizedProduct.name}</TableCell>
                    <TableCell>{normalizedProduct.available}</TableCell>
                    <TableCell>{normalizedProduct.sold}</TableCell>
                    <TableCell>
                      {category ? category.name : "No category"}
                    </TableCell>
                    <TableCell>
                      {normalizedProduct.colorIds &&
                      normalizedProduct.colorIds.length > 0
                        ? getColorNames(normalizedProduct.colorIds, color)
                        : "No colors available"}
                    </TableCell>
                    <TableCell>{normalizedProduct.price}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="secondary"
                        style={{ marginRight: 10 }}
                        onClick={() => handleOpen(normalizedProduct)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(normalizedProduct.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No products available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for editing or adding a product */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-product-modal-title"
        aria-describedby="edit-product-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            padding: 3,
            backgroundColor: "white",
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <h2 id="edit-product-modal-title">
            {selectedProduct ? "Edit Product" : "Add Product"}
          </h2>
          <div>
            <TextField
              label="Product Name"
              name="name"
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: 16 }}
            />
            <TextField
              label="Available"
              name="available"
              variant="outlined"
              value={formData.available}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: 16 }}
            />
            <TextField
              label="Sold"
              name="sold"
              variant="outlined"
              value={formData.sold}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: 16 }}
            />
            <TextField
              label="Price"
              name="price"
              variant="outlined"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: 16 }}
            />
            <FormControl fullWidth style={{ marginBottom: 16 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.categoryId}
                onChange={(event) => handleSelectChange(event, "categoryId")}
                label="Category"
              >
                {categories.map((category: any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth style={{ marginBottom: 16 }}>
              <InputLabel>Color</InputLabel>
              <Select
                multiple
                value={formData.colorIds}
                onChange={handleColorChange}
                label="Color"
              >
                {color.map((col: any) => (
                  <MenuItem key={col.id} value={col.id}>
                    {col.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              fullWidth
              style={{ marginTop: 20 }}
            >
              {selectedProduct ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </Box>
      </Modal>
    </Container>
  );
}
