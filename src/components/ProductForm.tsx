import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";

type ProductFormProps = {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  categories: any[];
  colorOptions: any[];
  onSave: () => void;
};

const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  setFormData,
  categories,
  colorOptions,
  onSave,
}) => {
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      categoryId: e.target.value as string,
    }));
  };

  const handleColorChange = (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      colorIds: e.target.value as number[],
    }));
  };

  return (
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

      {/* Category Select */}
      <FormControl fullWidth style={{ marginBottom: 16 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={formData.categoryId}
          onChange={handleCategoryChange}
          label="Category"
        >
          {categories.map((category: any) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Color Select */}
      <FormControl fullWidth style={{ marginBottom: 16 }}>
        <InputLabel>Color</InputLabel>
        <Select
          multiple
          value={formData.colorIds}
          onChange={handleColorChange}
          label="Color"
        >
          {colorOptions.map((color: any) => (
            <MenuItem key={color.id} value={color.id}>
              {color.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={onSave}
        fullWidth
        style={{ marginTop: 20 }}
      >
        Save Product
      </Button>
    </div>
  );
};

export default ProductForm;
