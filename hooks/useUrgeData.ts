import { useState, useEffect, useCallback } from "react";
import {
  UrgeLog,
  DashboardStats,
  LogFormData,
  CompletedLogFormData,
} from "../types";
import { storageService, logUrge } from "../services/StorageService";

export const useUrgeData = () => {
  const [logs, setLogs] = useState<UrgeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      const allLogs = await storageService.getAllUrgeLogs();
      setLogs(allLogs);
      setError(null);
    } catch (err) {
      setError("Failed to load urge logs");
      console.error("Error loading logs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // FIXED: Validate and convert form data before saving
  const addUrgeLog = useCallback(async (formData: LogFormData) => {
    try {
      // Validate that actedOn is not null before saving
      if (formData.actedOn === null) {
        throw new Error("Please indicate whether you acted on the urge");
      }

      // Convert to completed form data (actedOn is guaranteed to be boolean)
      const completedFormData: CompletedLogFormData = {
        ...formData,
        actedOn: formData.actedOn,
      };

      const newLog = await logUrge(completedFormData);
      setLogs((prev) => [newLog, ...prev]);
      return newLog;
    } catch (err) {
      setError("Failed to save urge log");
      throw err;
    }
  }, []);

  const updateLog = useCallback(async (updatedLog: UrgeLog) => {
    try {
      await storageService.updateUrgeLog(updatedLog);
      setLogs((prev) =>
        prev.map((log) => (log.id === updatedLog.id ? updatedLog : log))
      );
    } catch (err) {
      setError("Failed to update urge log");
      throw err;
    }
  }, []);

  const deleteLog = useCallback(async (logId: string) => {
    try {
      await storageService.deleteUrgeLog(logId);
      setLogs((prev) => prev.filter((log) => log.id !== logId));
    } catch (err) {
      setError("Failed to delete urge log");
      throw err;
    }
  }, []);

  const getTodaysLogs = useCallback(() => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    return logs.filter(
      (log) => log.timestamp >= startOfDay && log.timestamp <= endOfDay
    );
  }, [logs]);

  const getRecentWins = useCallback(
    (limit: number = 5) => {
      return logs
        .filter((log) => !log.actedOn && log.replacementAction)
        .slice(0, limit);
    },
    [logs]
  );

  // Helper function to validate form data
  const validateFormData = useCallback((formData: LogFormData): string[] => {
    const errors: string[] = [];

    if (!formData.urge.trim()) {
      errors.push("Please describe the urge you felt");
    }

    if (formData.actedOn === null) {
      errors.push("Please indicate whether you acted on the urge");
    }

    return errors;
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return {
    logs,
    loading,
    error,
    addUrgeLog,
    updateLog,
    deleteLog,
    getTodaysLogs,
    getRecentWins,
    validateFormData,
    refreshLogs: loadLogs,
  };
};
