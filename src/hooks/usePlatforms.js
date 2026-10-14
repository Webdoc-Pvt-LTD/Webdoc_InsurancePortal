// src/hooks/usePlatforms.js

import { useState, useEffect } from "react";
import { BASE_URL } from "../Config";

const API_BASE = `${BASE_URL}api/reporting`;

export function usePlatforms() {
  const [platforms, setPlatforms] = useState([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/platforms`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPlatforms(["ALL", ...data.data]);
      })
      .catch((err) => console.error("Failed to fetch platforms:", err))
      .finally(() => setLoadingPlatforms(false));
  }, []);

  return { platforms, loadingPlatforms };
}