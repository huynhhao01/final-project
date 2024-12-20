import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Paper,
  TextField,
} from "@mui/material";
import {
  fetchCategories,
  editCategoryThunk,
} from "../store/reducers/categoryReducer";
import { AppDispatch } from "../store";

// Define the Category type explicitly for TypeScript to infer the correct types
interface Category {
  id: number;
  name: string;
}

const Categories = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Access categories state from Redux
  const { categories, status, error } = useSelector(
    (state: any) => state.categories
  );

  // Local state to handle form inputs
  const [editingCategory, setEditingCategory] = useState<{
    idCategory: number | null;
    name: string;
  }>({ idCategory: null, name: "" });

  // Fetch categories when the component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  // Handle Edit button click
  const handleEdit = (category: Category) => {
    const { id, name } = category;
    setEditingCategory({ idCategory: id, name });
  };

  // Handle form submission (saving changes)
  const handleSave = () => {
    const { idCategory, name } = editingCategory;

    // Ensure idCategory is a number (convert it if necessary)
    const categoryId = Number(idCategory);

    // Validate if idCategory is a valid number and name is not empty
    if (categoryId && name.trim() !== "") {
      // Dispatch the save action
      dispatch(editCategoryThunk({ idCategory: categoryId, name }));

      // Optionally update the Redux state directly if needed (optimistic UI update)
      dispatch({
        type: "categories/updateCategory", // Replace with the actual action type if necessary
        payload: { id: categoryId, name },
      });

      // Reset form after saving
      setEditingCategory({ idCategory: null, name: "" });
    } else {
      console.error("Please fill out the form correctly.");
    }
  };

  // Return early if status is loading or failed
  if (status === "loading") {
    return <div>Loading categories...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table aria-label="category table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category: Category, index: number) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {/* Conditionally render TextField when editingCategory matches this row */}
                  {editingCategory.idCategory === category.id ? (
                    <TextField
                      label="Category Name"
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      fullWidth
                      error={editingCategory.name.trim() === ""}
                      helperText={
                        editingCategory.name.trim() === ""
                          ? "Name cannot be empty"
                          : ""
                      }
                    />
                  ) : (
                    category.name
                  )}
                </TableCell>
                <TableCell>
                  {editingCategory.idCategory === category.id ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Categories;
