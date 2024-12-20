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
  addCategoryThunk, // import the addCategory thunk
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

  // State to manage add category dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

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
    setCategoryToDelete(idCategory);  // Make sure idCategory is valid here
    setOpenDialog(true); // Show confirmation dialog
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (categoryToDelete !== null) {
      dispatch(deleteCategoryThunk(categoryToDelete))
        .unwrap()
        .then((idCategory) => {
          console.log(`Category with ID ${idCategory} deleted`);
          // Optionally update the state here
          // Remove the category from the local state to update the UI immediately
          dispatch(fetchCategories()); // Refetch categories after deletion, or optimistically remove it
        })
        .catch((error) => {
          console.error("Failed to delete category:", error);
          // Optionally show a notification or an error message to the user
        });
    }
    setOpenDialog(false); // Close the confirmation dialog
    setCategoryToDelete(null); // Reset categoryToDelete state
  };
  

  // Cancel deletion
  const cancelDelete = () => {
    setOpenDialog(false); // Close dialog without deleting
    setCategoryToDelete(null); // Reset category to delete
  };

  // Handle Add Category dialog open
  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
    setNewCategoryName(""); // Clear the input field when opening the dialog
  };

  // Handle Add Category dialog close
  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewCategoryName(""); // Clear the input field when closing the dialog
  };

  // Handle adding new category
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      dispatch(addCategoryThunk({ name: newCategoryName }));
      setNewCategoryName(""); // Reset the input field
      setOpenAddDialog(false); // Close the dialog
    } else {
      console.error("Category name cannot be empty.");
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
      {/* Add Category Button */}
      <Button variant="outlined" onClick={handleAddDialogOpen}>
        Add Category
      </Button>

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
                        disabled={editingCategory.idCategory !== null} // Disable if editing another category
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
          <Button onClick={confirmDelete} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleAddDialogClose}
        aria-labelledby="add-category-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            width: "600px",  // Increase modal width
            padding: "20px", // Add padding inside the modal
            maxWidth: "80%", // Responsive max width
            borderRadius: "8px", // Optional: rounded corners
          },
        }}
      >
        <DialogTitle id="add-category-dialog-title">Add Category</DialogTitle>
        <DialogContent>
          <TextField
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '1.5rem',  // Increase font size
                padding: '12px',     // Adjust padding for more height
                height: '60px',      // Adjust height of the input field
              },
              '& .MuiFormLabel-root': {
                fontSize: '1.2rem', // Increase label font size
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="secondary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Categories;
