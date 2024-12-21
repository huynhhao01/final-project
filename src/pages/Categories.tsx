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
  addCategoryThunk,
} from "../store/reducers/categoryReducer";
import { AppDispatch } from "../store";

// Update Category interface to reflect ID as a number
interface Category {
  id: number; // ID is now a number
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
    idCategory: number | null; // Update to number
    name: string;
  }>({ idCategory: null, name: "" });

  // State to manage delete confirmation dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null); // category ID is now number

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
    const { id, name } = category;
    setEditingCategory({ idCategory: id, name });
  };

  // Handle form submission (saving changes)
  const handleSave = () => {
    const { idCategory, name } = editingCategory;

    if (idCategory && name.trim() !== "") {
      // Optimistic UI Update: Immediately update the categories list in Redux
      const updatedCategories = categories.map((category: any) =>
        category.id === idCategory ? { ...category, name } : category
      );

      // Dispatch optimistic update to Redux
      dispatch({
        type: "categories/setCategories", // You should have an action to update categories
        payload: updatedCategories,
      });

      // Dispatch the editCategoryThunk to update the server data
      dispatch(editCategoryThunk({ idCategory, name }))
        .unwrap()
        .then(() => {
          console.log(`Category with ID ${idCategory} successfully updated`);
        })
        .catch((error) => {
          console.error("Failed to update category:", error);
        });

      setEditingCategory({ idCategory: null, name: "" });
    } else {
      console.error("Please fill out the form correctly.");
    }
  };

  // Handle Delete button click, open confirmation dialog
  const handleDelete = (categoryId: number) => {
    console.log("Attempting to delete category with ID:", categoryId);
    setCategoryToDelete(categoryId); // Save the number ID
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    console.log("Category to delete:", categoryToDelete);
    if (categoryToDelete !== null) {
      dispatch(deleteCategoryThunk(categoryToDelete))
        .unwrap()
        .then(() => {
          console.log(`Category with ID ${categoryToDelete} deleted`);
          dispatch(fetchCategories()); // Refetch categories to get the updated list
        })
        .catch((error) => {
          console.error("Failed to delete category:", error);
        });
    } else {
      console.error("No valid category ID to delete.");
    }

    setOpenDialog(false);
    setCategoryToDelete(null); // Reset categoryToDelete state after the operation
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setCategoryToDelete(null); // Reset category to delete
  };

  // Handle Add Category dialog open
  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
    setNewCategoryName("");
  };

  // Handle Add Category dialog close
  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewCategoryName("");
  };

  // Handle adding new category
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      dispatch(addCategoryThunk({ name: newCategoryName }));
      setNewCategoryName("");
      setOpenAddDialog(false);
    } else {
      console.error("Category name cannot be empty.");
    }
  };

  if (status === "loading") {
    return <div>Loading categories...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
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
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
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
                        onClick={() => handleDelete(category.id)} // Pass category.id (which is now a number)
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

      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
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

      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            fullWidth
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
