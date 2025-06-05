import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import { useUser } from "../context/UserContext";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  // Add more as needed
];

const UserProfile = () => {
  const { token, user, setUser } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [ratings, setRatings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    preferred_language: "en",
    profile_image_url: "",
  });

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      axios.get(API_ENDPOINTS.USERS, { headers: { Authorization: token } }),
      axios.get(`${API_ENDPOINTS.USERS}/ratings`, {
        headers: { Authorization: token },
      }),
    ])
      .then(([profileRes, ratingsRes]) => {
        setProfile(profileRes.data.user);
        setUser(profileRes.data.user);
        setForm({
          full_name: profileRes.data.user.full_name || "",
          phone_number: profileRes.data.user.phone_number || "",
          preferred_language: profileRes.data.user.preferred_language || "en",
          profile_image_url: profileRes.data.user.profile_image_url || "",
        });
        setRatings(ratingsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch profile info");
        setLoading(false);
      });
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.put(API_ENDPOINTS.USERS, form, {
        headers: { Authorization: token },
      });
      setProfile(res.data);
      setUser(res.data); // update context
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <Container sx={{ mt: 8 }}>
        <Alert severity="info">Please sign in to view your profile.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Avatar
            src={form.profile_image_url || "/default-avatar.png"}
            alt={form.full_name}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h4" component="h1" gutterBottom align="center">
            My Profile
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSave}>
          <TextField
            fullWidth
            label="Full Name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Preferred Language"
            name="preferred_language"
            value={form.preferred_language}
            onChange={handleChange}
            margin="normal"
            select
            required
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Profile Image URL"
            name="profile_image_url"
            value={form.profile_image_url}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
        {profile && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Email: {profile.email}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Account Created:{" "}
              {new Date(profile.created_at).toLocaleDateString()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Role: {profile.role}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Email Verified: {profile.is_verified_email ? "Yes" : "No"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Phone Verified: {profile.is_verified_phone ? "Yes" : "No"}
            </Typography>
            {ratings && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Seller Rating:{" "}
                  {ratings.rating_as_seller ??
                    profile.rating_as_seller ??
                    "N/A"}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Buyer Rating:{" "}
                  {ratings.rating_as_buyer ?? profile.rating_as_buyer ?? "N/A"}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;
