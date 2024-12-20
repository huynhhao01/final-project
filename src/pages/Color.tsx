import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchColors, createColor } from "../store/reducers/colorReducer"; // Adjust the path as needed
import { Button, Container, TextField } from "@mui/material";
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
    if (newColor) {
      dispatch(createColor({ name: newColor })); // Dispatch the createColor action to add a new color
      setNewColor(""); // Clear the input field after adding
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <Container>
      {/* Button rendering for each color */}
      <div>
        {color.length > 0 ? (
          color.map((colorItem: any) => (
            <Button
              key={colorItem.id}
              variant="outlined"
              color="secondary"
              sx={{ mx: 1, mb: 1 }}
            >
              {colorItem.name}
            </Button>
          ))
        ) : (
          <div>No colors available</div>
        )}
      </div>

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
