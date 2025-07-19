import { useState, useEffect, useCallback } from "react";
import { StreakGoal } from "../types";
import { storageService } from "../services/StorageService";

export const useStreaks = () => {
  const [streaks, setStreaks] = useState<StreakGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStreaks = useCallback(async () => {
    try {
      setLoading(true);
      const settings = await storageService.getUserSettings();
      setStreaks(settings.streakGoals);
      setError(null);
    } catch (err) {
      setError("Failed to load streaks");
      console.error("Error loading streaks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStreak = useCallback(
    async (streakId: string, success: boolean) => {
      try {
        const settings = await storageService.getUserSettings();
        const streak = settings.streakGoals.find((s) => s.id === streakId);

        if (streak) {
          if (success) {
            streak.currentStreak++;
          } else {
            streak.currentStreak = 0;
          }

          await storageService.saveUserSettings(settings);
          setStreaks([...settings.streakGoals]);
        }
      } catch (err) {
        setError("Failed to update streak");
        throw err;
      }
    },
    []
  );

  const addStreakGoal = useCallback(async (goal: Omit<StreakGoal, "id">) => {
    try {
      const settings = await storageService.getUserSettings();
      const newGoal: StreakGoal = {
        ...goal,
        id: Date.now().toString(),
      };

      settings.streakGoals.push(newGoal);
      await storageService.saveUserSettings(settings);
      setStreaks([...settings.streakGoals]);
    } catch (err) {
      setError("Failed to add streak goal");
      throw err;
    }
  }, []);

  const deleteStreakGoal = useCallback(async (streakId: string) => {
    try {
      const settings = await storageService.getUserSettings();
      settings.streakGoals = settings.streakGoals.filter(
        (s) => s.id !== streakId
      );
      await storageService.saveUserSettings(settings);
      setStreaks([...settings.streakGoals]);
    } catch (err) {
      setError("Failed to delete streak goal");
      throw err;
    }
  }, []);

  const getLongestStreak = useCallback(() => {
    return Math.max(...streaks.map((s) => s.currentStreak), 0);
  }, [streaks]);

  const getActiveStreaks = useCallback(() => {
    return streaks.filter((s) => s.isActive);
  }, [streaks]);

  useEffect(() => {
    loadStreaks();
  }, [loadStreaks]);

  return {
    streaks,
    loading,
    error,
    updateStreak,
    addStreakGoal,
    deleteStreakGoal,
    getLongestStreak,
    getActiveStreaks,
    refreshStreaks: loadStreaks,
  };
};
