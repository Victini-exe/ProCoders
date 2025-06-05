import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useCategories } from "../hooks/useCategories";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import { useUser } from "../context/UserContext";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  images: any[];
  category: string;
  category_id: number;
  [key: string]: any;
};

const LandingPage = () => {
  const { token } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | number>(
    "ALL"
  );
  const [sortOption, setSortOption] = useState("none");

  useEffect(() => {
    setLoadingProducts(true);
    axios
      .get(API_ENDPOINTS.PRODUCTS, {
        headers: token ? { Authorization: token } : {},
      })
      .then((res) => {
        setProducts(res.data.products || []);
        setLoadingProducts(false);
      })
      .catch((err) => {
        setProductsError("Failed to fetch products");
        setLoadingProducts(false);
      });
  }, [token]);

  const { categories, loading, error } = useCategories();

  // Helper to get the correct image URL
  const getImageUrl = (img: any) => {
    if (!img || typeof img !== "object" || !img.image_url) return null;
    if (img.image_url.startsWith("http")) return img.image_url;
    return `http://127.0.0.1:5000${img.image_url}`;
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "ALL" ||
      String(product.category_id) === String(selectedCategory) ||
      String(product.category) === String(selectedCategory);
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products based on sortOption
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-asc") {
      return a.price - b.price;
    } else if (sortOption === "price-desc") {
      return b.price - a.price;
    } else if (sortOption === "name-asc") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "name-desc") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to EcoFinds
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Sustainable Marketplace for Second-Hand Treasures
          </Typography>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Browse by Category
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Button
              variant={selectedCategory === "ALL" ? "contained" : "outlined"}
              onClick={() => setSelectedCategory("ALL")}
            >
              ALL
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  String(selectedCategory) === String(category.id) ||
                  String(selectedCategory) === String(category.name)
                    ? "contained"
                    : "outlined"
                }
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </Box>
        )}
        {/* Search Input and Sort Dropdown */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              maxWidth: 400,
            }}
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          >
            <option value="none">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
        </Box>
      </Container>

      {/* Featured Products Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Products
        </Typography>
        {loadingProducts ? (
          <CircularProgress />
        ) : productsError ? (
          <Alert severity="error">{productsError}</Alert>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {sortedProducts.length === 0 ? (
              <Box sx={{ width: "100%" }}>
                <Alert severity="info">No products found.</Alert>
              </Box>
            ) : (
              sortedProducts.map((product) => (
                <Box key={product.id} sx={{ flex: "1 1 300px", maxWidth: 350 }}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {getImageUrl(product.images && product.images[0]) && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(product.images[0])}
                        alt={product.title}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.title}
                      </Typography>
                      <Typography>{product.description}</Typography>
                      <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                        ${product.price}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              ))
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default LandingPage;
