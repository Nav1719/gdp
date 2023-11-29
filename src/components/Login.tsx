import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  FormControlLabel,
  LinearProgress,
  Stack,
  TextField,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import DataService from "../Services/data.service";
import "./Login.css";
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      Welcome to the website @ {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const [authType, setAuthType] = React.useState("login");
  const [userDetails, setUserDetails] = React.useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [loading, setLoading] = React.useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateEmail(userDetails.email)) {
      alert("Invalid email");
    }

    if (!userDetails?.password?.trim()) {
      alert("Password cannot be blank or empty");
    }

    switch (authType) {
      case "register":
        return attemptRegister();
      case "login":
        return attemptLogin();
      default:
        return;
    }
  };

  const attemptRegister = async () => {
    try {
      if (
        Object.values(userDetails).every(
          (value: any) => value !== null && value !== undefined && value !== ""
        )
      ) {
        setLoading(true);
        const res = await DataService.createAccount(userDetails);
        if (res) {
          alert("Registered successfully, please proceed to login");
          setAuthType("login");
        } else throw new Error("");
      } else {
        alert("All fields are required");
      }
    } catch (e) {
      alert("Unable to register user");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const attemptLogin = async () => {
    try {
      if (userDetails.email?.trim() && userDetails.password) {
        setLoading(true);
        const res = await DataService.getUserByEmailAndPassword(
          userDetails.email,
          userDetails.password
        );
        if (res) {
          setAuthType("login");
          const { email, isAdmin, name, isSuperUser, isVerifiedAdmin } = res;
          DataService.rememberUser({
            email,
            isAdmin,
            name,
            isSuperUser,
            isVerifiedAdmin,
          });
          if (res.isAdmin) {
            navigate("/admin");
          } else {
            navigate("/user");
          }
        } else throw new Error("");
      } else {
        alert("All fields are required");
      }
    } catch (e) {
      alert("Unable to login please check you email and password");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (event: any) => {
    setUserDetails((currValue) => ({
      ...currValue,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="area">
        <Container component="main" className="container-login" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {loading && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress color="secondary" />
              </Box>
            )}
            {authType === "login" ? (
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
            ) : (
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <AccountCircleOutlinedIcon />
              </Avatar>
            )}
            <Typography component="h1" variant="h5">
              {authType.toUpperCase()}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                id="name"
                label="Name"
                fullWidth
                name="name"
                variant="outlined"
                hidden={authType === "login"}
                value={userDetails.name}
                onChange={onChange}
              />
              <TextField
                margin="normal"
                required
                id="email"
                label="Email"
                fullWidth
                name="email"
                variant="outlined"
                value={userDetails.email}
                onChange={onChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={userDetails.password}
                onChange={onChange}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name="isAdmin"
                    checked={userDetails.isAdmin}
                    onChange={(event) => {
                      setUserDetails((currVal) => ({
                        ...currVal,
                        isAdmin: event.target.checked,
                      }));
                    }}
                  />
                }
                label="Admin"
                hidden={authType === "login"}
              />
              <div hidden={authType === "register"}>
                <br /> <br />
              </div>

              <Stack direction={"row"} spacing={2}>
                <Button
                  type="button"
                  fullWidth
                  variant="text"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => {
                    if (authType === "login") {
                      setAuthType("register");
                    } else if (authType === "register") {
                      setAuthType("login");
                    }
                  }}
                >
                  {authType === "login" ? "Sign up" : "Sign in"}
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => {}}
                >
                  {authType === "login" ? "Sign in" : "Sign up"}
                </Button>
              </Stack>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                {/* <Grid item>
                {/* <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link> */}
                {/* </Grid> */}
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </ThemeProvider>
  );
}
