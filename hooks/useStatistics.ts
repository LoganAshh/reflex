import { useState, useEffect, useCallback } from "react";
import { DashboardStats } from "../types";
import { storageService } from "../services/StorageService";

export const useStatistics = (timeframe: "week" | "month" | "all" = "week") => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const days = timeframe === "week" ? 7 : timeframe === "month" ? 30 : 365;
      const statistics = await storageService.getUrgeStatistics(days);
      setStats(statistics);
      setError(null);
    } catch (err) {
      setError("Failed to load statistics");
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: loadStats,
  };
};
