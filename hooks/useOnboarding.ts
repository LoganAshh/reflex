import { useState, useEffect, useCallback } from "react";
import { storageService } from "../services/StorageService";

export const useOnboarding = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const checkOnboardingStatus = useCallback(async () => {
    try {
      setLoading(true);
      const settings = await storageService.getUserSettings();
      setIsOnboardingCompleted(settings.onboardingCompleted);
    } catch (err) {
      console.error("Error checking onboarding status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      const settings = await storageService.getUserSettings();
      settings.onboardingCompleted = true;
      await storageService.saveUserSettings(settings);
      setIsOnboardingCompleted(true);
    } catch (err) {
      console.error("Error completing onboarding:", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  return {
    isOnboardingCompleted,
    loading,
    completeOnboarding,
  };
};
