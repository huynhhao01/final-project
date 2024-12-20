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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  fetchCategories,
  editCategoryThunk,
  deleteCategoryThunk,
} from "../store/reducers/categoryReducer";
import { AppDispatch } from "../store";

// Define the Category type explicitly for TypeScript to infer the correct types
interface Category {
  idCategory: number;
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

  // State to manage delete confirmation dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Fetch categories when the component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  // Handle Edit button click
  const handleEdit = (category: Category) => {
    const { idCategory, name } = category;
    setEditingCategory({ idCategory, name });
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
        payload: { idCategory: categoryId, name },
      });

      // Reset form after saving
      setEditingCategory({ idCategory: null, name: "" });
    } else {
      console.error("Please fill out the form correctly.");
    }
  };

  // Handle Delete button click, open confirmation dialog
  const handleDelete = (idCategory: number) => {
    setCategoryToDelete(idCategory);
    setOpenDialog(true); // Show confirmation dialog
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (categoryToDelete !== null) {
      dispatch(deleteCategoryThunk(categoryToDelete)); // Dispatch the delete action
    }
    setOpenDialog(false); // Close dialog
    setCategoryToDelete(null); // Reset category to delete
  };

  // Cancel deletion
  const cancelDelete = () => {
    setOpenDialog(false); // Close dialog without deleting
    setCategoryToDelete(null); // Reset category to delete
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
      <Button variant="outlined">Add</Button>
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
              <TableRow key={category.idCategory}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {/* Conditionally render TextField when editingCategory matches this row */}
                  {editingCategory.idCategory === category.idCategory ? (
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
                  {editingCategory.idCategory === category.idCategory ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(category.idCategory)} // Trigger delete confirmation
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            No
          </Button>
          <Button
            onClick={confirmDelete}
            color="secondary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Categories;
