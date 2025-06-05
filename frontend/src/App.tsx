import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SellProduct from "./pages/SellProduct";
import MyListings from "./pages/MyListings";
import UserProfile from "./pages/UserProfile";
import { UserProvider } from "./context/UserContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32", // Green color for eco-friendly theme
    },
    secondary: {
      main: "#FFA000", // Amber color for accents
    },
  },
});

function App() {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/sell" element={<SellProduct />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
