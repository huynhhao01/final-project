import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Link, Outlet } from "react-router-dom";
import SideBar from "./SideBar";

// const pages = ["Products", "Categories", "Color"];

const Nav = () => {
  return (
    <>
      <AppBar position="static" sx={{ mb: 5 }}>
        <Container maxWidth="xl">
          <MenuItem>
            <Typography
              variant="h5"
              noWrap
              component="div"
              //   sx={{ display: { xs: "none", sm: "block" } }}
              sx={{ margin: ".5rem 1rem .5rem", color: "white" }}
            >
              <Link
                to="/seller/products"
                style={{ textDecoration: "none", color: "white" }}
              >
                Products
              </Link>
            </Typography>

            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ margin: ".5rem 1rem .5rem" }}
            >
              <Link
                to="/seller/categories"
                style={{ textDecoration: "none", color: "white" }}
              >
                Categories
              </Link>
            </Typography>

            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ margin: ".5rem 1rem .5rem" }}
            >
              <Link
                to="/seller/color"
                style={{ textDecoration: "none", color: "white" }}
              >
                Color
              </Link>
            </Typography>
          </MenuItem>
        </Container>
      </AppBar>
      <Outlet />
    </>
  );
};

export default Nav;
