import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { fetchCategories } from "../store/reducers/categoryReducer";
import { AppDispatch } from "../store"; 

const Categories: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Access categories state from Redux
  const { categories, status, error } = useSelector(
    (state: any) => state.categories
  ); // Type useSelector correctly

  // Fetch categories when the component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  // Handle Edit and Delete button clicks
  const handleEdit = (idCategory: number) => {
    console.log(`Editing category with id: ${idCategory}`);
  };

  const handleDelete = (idCategory: number) => {
    console.log(`Deleting category with id: ${idCategory}`);
  };

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
            {categories.map((category: any, index: number) => (
              <TableRow key={category.idCategory}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleEdit(category.idCategory)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(category.idCategory)}
                  >
                    Delete
                  </Button>
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
