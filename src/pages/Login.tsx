import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { loginAsync } from "../store/reducers/authReducer";
import { AppDispatch } from "../store";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Select authentication state
  const { status, error, isLoggedIn } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/seller/products"); // Redirect to home page if the user is already logged in
    }
  }, [isLoggedIn, navigate]); // Dependency on isLoggedIn and navigate

  const handleChangeLogin = (type: string, e: any) => {
    setLoginData({ ...loginData, [type]: e.target.value });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();

    // Dispatch the login action
    const result = await dispatch(
      loginAsync({
        email: loginData.email,
        password: loginData.password,
      })
    );

    // Check if the login was successful
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/seller/products"); // Redirect to home page after successful login
    } else {
      alert(error || "Invalid credentials or login failed.");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <h2 style={{ textAlign: "center" }}>Login</h2>
      <Grid container spacing={3}>
        <Grid item md={3}></Grid>
        <Grid item md={6}>
          <form onSubmit={handleLogin}>
            <FormControl fullWidth sx={{ m: 1 }} variant="filled">
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                value={loginData.email}
                onChange={(e) => handleChangeLogin("email", e)}
              />
              <TextField
                label="Password"
                variant="outlined"
                sx={{ my: 2 }}
                type="password"
                value={loginData.password}
                onChange={(e) => handleChangeLogin("password", e)}
              />
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Logging in..." : "Login"}
                </Button>
              </Grid>
            </FormControl>
          </form>
        </Grid>
        <Grid item md={3}></Grid>
      </Grid>
    </Box>
  );
};

export default Login;
