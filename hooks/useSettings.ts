import { useState, useEffect, useCallback } from "react";
import { UserSettings } from "../types";
import { storageService } from "../services/StorageService";

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const userSettings = await storageService.getUserSettings();
      setSettings(userSettings);
      setError(null);
    } catch (err) {
      setError("Failed to load settings");
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(
    async (newSettings: Partial<UserSettings>) => {
      try {
        if (!settings) return;

        const updatedSettings = { ...settings, ...newSettings };
        await storageService.saveUserSettings(updatedSettings);
        setSettings(updatedSettings);
      } catch (err) {
        setError("Failed to update settings");
        throw err;
      }
    },
    [settings]
  );

  const toggleNotifications = useCallback(async () => {
    if (settings) {
      await updateSettings({
        notificationsEnabled: !settings.notificationsEnabled,
      });
    }
  }, [settings, updateSettings]);

  const updateReminderTime = useCallback(
    async (time: string) => {
      await updateSettings({ dailyReminderTime: time });
    },
    [updateSettings]
  );

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    toggleNotifications,
    updateReminderTime,
    refreshSettings: loadSettings,
  };
};
