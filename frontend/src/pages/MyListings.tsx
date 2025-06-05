import { useEffect, useState } from "react";
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
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import { useUser } from "../context/UserContext";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  created_at: string;
  // Add other fields as needed
}

// Helper to get the correct image URL
const getImageUrl = (img: any) => {
  if (!img || typeof img !== "object" || !img.image_url) return null;
  if (img.image_url.startsWith("http")) return img.image_url;
  return `http://127.0.0.1:5000${img.image_url}`;
};

const MyListings = () => {
  const { user, token } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`${API_ENDPOINTS.PRODUCTS}?user_id=${user.id}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setProducts(res.data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch your listings");
        setLoading(false);
      });
  }, [user, token]);

  if (!user) {
    return (
      <Container sx={{ mt: 8 }}>
        <Alert severity="info">Please sign in to view your listings.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Listings
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : products.length === 0 ? (
        <Alert severity="info">You have no listings yet.</Alert>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {products.map((product) => (
            <Box key={product.id} sx={{ flex: "1 1 300px", maxWidth: 350 }}>
              <Card>
                {getImageUrl(product.images && product.images[0]) && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageUrl(product.images[0])}
                    alt={product.title}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    ${product.price}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Listed on:{" "}
                    {new Date(product.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MyListings;
