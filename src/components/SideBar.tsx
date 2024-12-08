import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <div>
      <Divider />
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemText>
              <Typography
                variant="h5"
                noWrap
                component="div"
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
            </ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </div>
  );
}
