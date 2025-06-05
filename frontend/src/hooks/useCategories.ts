import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import { useUser } from "../context/UserContext";

export interface Category {
  id: number;
  name: string;
}

export function useCategories() {
  const { token } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(API_ENDPOINTS.CATEGORIES, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        setCategories(res.data?.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch categories");
        setLoading(false);
      });
  }, [token]);

  return { categories, loading, error };
}
