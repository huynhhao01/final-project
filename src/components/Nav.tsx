import React, { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
// import { ChevronLeft } from "@mui/icons-material";

const Nav = () => {
  const [open, setOpen] = useState(true); // State to toggle the sidebar

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Drawer
          sx={{
            width: 240, // Sidebar width
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
          onClose={toggleDrawer}
        >
          {/* <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
            <ChevronLeft onClick={toggleDrawer} style={{ cursor: "pointer" }} />
          </Box> */}
          <List>
            {/* Products Link with outlined style */}
            <ListItem
              component="a"
              sx={{
                border: "1px solid", // Add border for outlined style
                borderColor: "primary.main", // Border color using theme
                borderRadius: "4px", // Rounded corners
                marginBottom: "8px", // Space between items
                "&:hover": {
                  backgroundColor: "primary.light", // Highlight on hover
                  borderColor: "primary.dark", // Darker border on hover
                },
              }}
            >
              <ListItemText>
                <Link
                  to="/seller/products"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Products
                </Link>
              </ListItemText>
            </ListItem>

            {/* Categories Link with outlined style */}
            <ListItem
              component="a"
              sx={{
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: "4px",
                marginBottom: "8px",
                "&:hover": {
                  backgroundColor: "primary.light",
                  borderColor: "primary.dark",
                },
              }}
            >
              <ListItemText>
                <Link
                  to="/seller/categories"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Categories
                </Link>
              </ListItemText>
            </ListItem>

            {/* Color Link with outlined style */}
            <ListItem
              component="a"
              sx={{
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: "4px",
                marginBottom: "8px",
                "&:hover": {
                  backgroundColor: "primary.light",
                  borderColor: "primary.dark",
                },
              }}
            >
              <ListItemText>
                <Link
                  to="/seller/color"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Color
                </Link>
              </ListItemText>
            </ListItem>
          </List>
          <Divider />
        </Drawer>

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default Nav;
