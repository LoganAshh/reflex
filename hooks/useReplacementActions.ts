import { useState, useEffect, useCallback } from "react";
import { ReplacementAction } from "../types";
import { storageService } from "../services/StorageService";

export const useReplacementActions = () => {
  const [actions, setActions] = useState<ReplacementAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedToday, setCompletedToday] = useState<string[]>([]);

  const loadActions = useCallback(async () => {
    try {
      setLoading(true);
      const replacementActions = await storageService.getReplacementActions();
      setActions(replacementActions);
      setError(null);
    } catch (err) {
      setError("Failed to load replacement actions");
      console.error("Error loading actions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markActionCompleted = useCallback(
    async (actionId: string, effectiveness?: number) => {
      try {
        await storageService.recordReplacementActionUsage(
          actionId,
          effectiveness
        );
        setCompletedToday((prev) => [...prev, actionId]);

        // Update the action's usage count in local state
        setActions((prev) =>
          prev.map((action) =>
            action.id === actionId
              ? { ...action, timesUsed: action.timesUsed + 1, effectiveness }
              : action
          )
        );
      } catch (err) {
        setError("Failed to record action completion");
        throw err;
      }
    },
    []
  );

  const getActionsByCategory = useCallback(
    (category: string) => {
      if (category === "all") return actions;
      return actions.filter((action) => action.category === category);
    },
    [actions]
  );

  const getPopularActions = useCallback(
    (limit: number = 5) => {
      return [...actions]
        .sort((a, b) => b.timesUsed - a.timesUsed)
        .slice(0, limit);
    },
    [actions]
  );

  const resetDailyCompletions = useCallback(() => {
    setCompletedToday([]);
  }, []);

  useEffect(() => {
    loadActions();

    // Reset completed actions at midnight
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(resetDailyCompletions, msUntilMidnight);
    return () => clearTimeout(timeout);
  }, [loadActions, resetDailyCompletions]);

  return {
    actions,
    loading,
    error,
    completedToday,
    markActionCompleted,
    getActionsByCategory,
    getPopularActions,
    refreshActions: loadActions,
  };
};
