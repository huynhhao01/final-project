import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";

export default function Products() {
  return (
    <Container>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Sold</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Price</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>T-shirt</TableCell>
              <TableCell>23</TableCell>
              <TableCell>10</TableCell>
              <TableCell>Cloth</TableCell>
              <TableCell>white, pink</TableCell>
              <TableCell>300,000</TableCell>
              <TableCell>
                <Button variant="outlined" color="secondary">
                  Edit
                </Button>
                <Button variant="outlined" color="error">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}