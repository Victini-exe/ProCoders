import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { user, logout } = useUser();

  return (
    <AppBar position="static">
      <Toolbar>
        <ShoppingBagIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
          }}
        >
          EcoFinds
        </Typography>
        <Box style={{ backgroundColor: "rgb(152, 52, 151)" }}>
          {user ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/sell"
                startIcon={<AddCircleOutlineIcon />}
                sx={{ mr: 2 }}
              >
                Sell Product
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/my-listings"
                sx={{ mr: 2 }}
              >
                My Listings
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/profile"
                sx={{ mr: 2 }}
              >
                Profile
              </Button>
              <Typography component="span" sx={{ mr: 2, color: "inherit" }}>
                Welcome, {user.full_name}
              </Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ mr: 2 }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={RouterLink}
                to="/signup"
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
