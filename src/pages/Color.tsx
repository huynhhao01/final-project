import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchColors } from "../store/reducers/colorReducer"; // Adjust the path as needed
import { Button, Container, TextField, Table, TableBody, TableCell, TableRow, TableHead, TableContainer, Paper } from "@mui/material";
import { AppDispatch } from "../store"; // Adjust the import if necessary

export default function Color() {
  const dispatch = useDispatch<AppDispatch>();
  const { color, status, error } = useSelector((state: any) => state.color); // Assuming `state.color` holds the colors

  const [newColor, setNewColor] = useState<string>("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchColors()); // Dispatch the fetchColors action when the component mounts
    }
  }, [dispatch, status]);

  // Handle adding a new color
  const handleAddColor = () => {
    if (newColor && !color.some((col: any) => col.name.toLowerCase() === newColor.toLowerCase())) {
      const newColorObj = {
        id: (color.length + 1).toString(),
        name: newColor,
      };
      // You can dispatch an action to save this color if needed
      // For now, we'll just add it locally as an example
      // dispatch(addColor(newColorObj));
      setNewColor(""); // Clear input field after adding
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {color.length > 0 ? (
              color.map((colorItem: any, index: number) => (
                <TableRow key={colorItem.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="secondary" sx={{ mx: 1, mb: 1 }}>
                      {colorItem.name}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No colors available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Input form for adding a new color */}
      <div>
        <TextField
          label="Enter color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          sx={{ mx: 1, width: "15ch" }}
          size="small"
        />
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mx: 1 }}
          onClick={handleAddColor}
        >
          +
        </Button>
      </div>
    </Container>
  );
}
