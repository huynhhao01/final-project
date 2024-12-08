import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Container } from "@mui/material";

export default function Color() {
  return (
    <Container>
      {/* <TableContainer component={Paper}> */}
      {/* <Table> */}
      {/* <TableBody> */}
      <TableRow>
        <Button variant="outlined" color="secondary">
          White
        </Button>

        <Button variant="outlined" color="secondary">
          Yellow
        </Button>

        <Button variant="outlined" color="secondary">
          Pink
        </Button>

        <Button variant="outlined" color="secondary">
          Red
        </Button>
        <Button variant="outlined" color="secondary">
          Black
        </Button>

        <Button variant="outlined" color="secondary">
          Blue
        </Button>

        <Button variant="outlined" color="secondary">
          Silver
        </Button>
        {/* <Button> */}
        <TextField
          label="Enter color"
        //   id="outlined-start-adornment"
          sx={{ mx: 1, width: "15ch"}}
          size="small"
        />
        {/* </Button> */}
        <Button variant="outlined" color="secondary">
          +
        </Button>
      </TableRow>
      {/* </TableBody> */}
      {/* </Table> */}
      {/* </TableContainer> */}
    </Container>
  );
}
