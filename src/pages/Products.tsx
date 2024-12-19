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
import { fetchProducts, updateProduct } from "../store/reducers/productReducer"; // Adjust path as needed
import { fetchColors } from "../store/reducers/colorReducer"; // Adjust path as needed
import { AppDispatch } from "../store"; // Import RootState and AppDispatch from store

// Helper function to get color names based on colorIds
const getColorNames = (colorIds: any[], colorData: any[]) => {
  if (!Array.isArray(colorIds) || colorIds.length === 0) {
    return "No colors available"; // If colorIds is empty or invalid
  }

  if (!Array.isArray(colorData) || colorData.length === 0) {
    return "Color data not available"; // Return fallback message if color data is missing
  }

  // Map colorIds to actual color names
  return colorIds
    .map((colorId) => {
      const colorItem = colorData.find(
        (col: any) => String(col.id) === String(colorId)
      );
      return colorItem ? colorItem.name : "Unknown Color"; // Return color name or fallback if not found
    })
    .join(", "); // Join color names with commas for display
};

export default function Products() {
  const dispatch = useDispatch<AppDispatch>(); // Properly typed dispatch
  const { products, status, error } = useSelector(
    (state: any) => state.products
  ); // Properly typed state for products
  const { color } = useSelector((state: any) => state.color); // Properly typed state for colors

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
    colorIds: [] as number[], // Handle multiple colors
  });

  const normalizeProductData = (product: any) => {
    const normalizedProduct = { ...product };

    // Normalize the colorIds field to always be numbers
    if (normalizedProduct.colorIds) {
      normalizedProduct.colorIds = normalizedProduct.colorIds.map((id: any) =>
        Number(id)
      );
    }

    return normalizedProduct;
  };

  const handleOpen = (product: any) => {
    setSelectedProduct(product); // Set the product that was clicked
    setFormData({
      name: product.name,
      available: product.available,
      sold: product.sold,
      categoryId: product.categoryId,
      price: product.price,
      colorIds: product.colorIds || [],
    }); // Initialize form data with the selected product
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
  };

  const handleSave = () => {
    console.log("Form Data before Save:", formData);

    if (!formData.name || formData.available < 0 || formData.price <= 0) {
      alert("Please fill in all fields correctly");
      return;
    }

    // Log to check if formData is updated correctly
    console.log("Form Data before Save:", formData);

    if (selectedProduct) {
      // Dispatch the action to update the product, including the updated colorIds
      dispatch(
        updateProduct({
          ...formData,
          colorIds: formData.colorIds, // Ensure colorIds is updated correctly
          id: selectedProduct.id,
        })
      );
    }

    handleClose(); // Close the modal after saving
  };

  // Separate handler for Select changes
  const handleSelectChange = (event: any, name: string) => {
    const value = event.target.value as string | number | string[] | number[]; // Adjust the value type based on the field
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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
    // Get the current selection from the event, ensure it’s an array of numbers
    const selectedColorIds = event.target.value as number[];

    // Manually toggle the colors in the `colorIds` array, ensuring values are numbers
    const newColorIds = selectedColorIds.reduce((acc: number[], id: number) => {
      // Ensure the color ID is a number
      const numericId = Number(id);

      // If the color is already in the list, remove it, otherwise add it
      if (acc.includes(numericId)) {
        return acc.filter((colorId) => colorId !== numericId); // Remove if already selected
      } else {
        return [...acc, numericId]; // Add if not already selected
      }
    }, []);

    console.log("Updated Color IDs (after toggle, as numbers):", newColorIds); // Log to check array

    // Update the state with the newly toggled color IDs
    setFormData((prevState) => ({
      ...prevState,
      colorIds: newColorIds, // Ensure colorIds is an array of numbers
    }));
  };

  // Fetch products and colors when the component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts()); // Dispatch action to fetch products
      dispatch(fetchColors()); // Dispatch action to fetch colors
    }
  }, [dispatch, status]);

  // Check if color data is still being fetched
  if (status === "loading" || !color || color.length === 0) {
    return <div>Loading colors...</div>; // Loading state for color
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
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

                return (
                  <TableRow key={normalizedProduct.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{normalizedProduct.name}</TableCell>
                    <TableCell>{normalizedProduct.available}</TableCell>
                    <TableCell>{normalizedProduct.sold}</TableCell>
                    <TableCell>{normalizedProduct.categoryId}</TableCell>
                    <TableCell>
                      {/* Display color names using normalized colorIds */}
                      {normalizedProduct.colorIds &&
                      normalizedProduct.colorIds.length > 0
                        ? getColorNames(normalizedProduct.colorIds, color) // Map colorIds to color names
                        : "No colors available"}
                    </TableCell>
                    <TableCell>{normalizedProduct.price}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="secondary"
                        style={{ marginRight: 10 }}
                        onClick={() => handleOpen(normalizedProduct)} // Open the modal and pass the product
                      >
                        Edit
                      </Button>
                      <Button variant="outlined" color="error">
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

      {/* Modal for editing product */}
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
            transform: "translate(-50%, -50%)", // Center the modal
            width: 400,
            padding: 3,
            backgroundColor: "white",
            boxShadow: 24, // Box shadow to make it stand out
            borderRadius: 2, // Optional: rounded corners for a better look
          }}
        >
          <h2 id="edit-product-modal-title">Edit Product</h2>
          {selectedProduct ? (
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
                <InputLabel>Color</InputLabel>
                <Select
                  multiple
                  value={formData.colorIds} // This should be an array of selected color IDs
                  onChange={handleColorChange} // Updates the colorIds in the state
                  label="Color"
                >
                  {color.map((col: any) => (
                    <MenuItem
                      key={col.id}
                      value={col.id}
                      // No 'disabled' property here, allowing toggling
                    >
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
                Save Changes
              </Button>
            </div>
          ) : (
            <div>Loading product data...</div>
          )}
        </Box>
      </Modal>
    </Container>
  );
}
