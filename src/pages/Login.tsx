import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { LOGIN } from "../store/reducers/authReducer";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

const Login = () => {
  const auth = useSelector((state: { auth: any }) => state.auth);
  const dispatch = useDispatch();
  const formRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let emailVal = "",
      passwordVal = "";

    if (formRef.current.email) {
      emailVal = formRef.current?.email.value;
    }

    if (formRef.current.password) {
      passwordVal = formRef.current?.password.value;
    }

    dispatch({
      type: LOGIN,
      email: emailVal,
      password: passwordVal,
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <h2 style={{ textAlign: "center" }}>Login</h2>
      <Grid container spacing={3}>
        <Grid item md={3}></Grid>
        <Grid item md={6}>
          <FormControl
            fullWidth
            sx={{ m: 1 }}
            variant="filled"
            onSubmit={handleLogin}
          >
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              inputRef={(element) => (formRef.current["email"] = element)}
            />
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              sx={{ my: 2 }}
              inputRef={(element) => (formRef.current["password"] = element)}
            />
            <Grid item>
              <Button variant="contained">Login</Button>
            </Grid>
          </FormControl>
        </Grid>
        <Grid item md={3}></Grid>
      </Grid>
    </Box>
  );
};

export default Login;
