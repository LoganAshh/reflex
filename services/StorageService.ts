import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UrgeLog {
  id: string;
  urge: string;
  location: string;
  trigger: string;
  actedOn: boolean;
  timestamp: Date;
  replacementAction?: string;
  notes?: string;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  dailyReminderTime: string;
  selectedReplacementActions: string[];
  streakGoals: StreakGoal[];
}

export interface StreakGoal {
  id: string;
  title: string;
  targetDays: number;
  currentStreak: number;
  category: string;
}

class StorageService {
  private static instance: StorageService;
  private readonly URGE_LOGS_KEY = "urge_logs";
  private readonly USER_SETTINGS_KEY = "user_settings";
  private readonly STREAKS_KEY = "streaks";

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Urge Logs Management
  async saveUrgeLog(log: UrgeLog): Promise<void> {
    try {
      const existingLogs = await this.getAllUrgeLogs();
      const updatedLogs = [log, ...existingLogs];
      await AsyncStorage.setItem(
        this.URGE_LOGS_KEY,
        JSON.stringify(updatedLogs)
      );
    } catch (error) {
      console.error("Error saving urge log:", error);
      throw error;
    }
  }

  async getAllUrgeLogs(): Promise<UrgeLog[]> {
    try {
      const logs = await AsyncStorage.getItem(this.URGE_LOGS_KEY);
      if (logs) {
        const parsedLogs = JSON.parse(logs);
        // Convert timestamp strings back to Date objects
        return parsedLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error getting urge logs:", error);
      return [];
    }
  }

  async getUrgeLogsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<UrgeLog[]> {
    try {
      const allLogs = await this.getAllUrgeLogs();
      return allLogs.filter(
        (log) => log.timestamp >= startDate && log.timestamp <= endDate
      );
    } catch (error) {
      console.error("Error getting logs by date range:", error);
      return [];
    }
  }

  async deleteUrgeLog(logId: string): Promise<void> {
    try {
      const logs = await this.getAllUrgeLogs();
      const filteredLogs = logs.filter((log) => log.id !== logId);
      await AsyncStorage.setItem(
        this.URGE_LOGS_KEY,
        JSON.stringify(filteredLogs)
      );
    } catch (error) {
      console.error("Error deleting urge log:", error);
      throw error;
    }
  }

  // Analytics and Patterns
  async getUrgeStatistics(days: number = 30): Promise<{
    totalUrges: number;
    urgesResisted: number;
    successRate: number;
    commonTriggers: { trigger: string; count: number }[];
    commonUrges: { urge: string; count: number }[];
    hourlyDistribution: { hour: number; count: number }[];
  }> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const logs = await this.getUrgeLogsByDateRange(startDate, endDate);

      const totalUrges = logs.length;
      const urgesResisted = logs.filter((log) => !log.actedOn).length;
      const successRate =
        totalUrges > 0 ? Math.round((urgesResisted / totalUrges) * 100) : 0;

      // Count triggers
      const triggerCounts: { [key: string]: number } = {};
      logs.forEach((log) => {
        if (log.trigger) {
          triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1;
        }
      });

      // Count urges
      const urgeCounts: { [key: string]: number } = {};
      logs.forEach((log) => {
        urgeCounts[log.urge] = (urgeCounts[log.urge] || 0) + 1;
      });

      // Hour distribution
      const hourCounts: { [key: number]: number } = {};
      for (let i = 0; i < 24; i++) {
        hourCounts[i] = 0;
      }
      logs.forEach((log) => {
        const hour = log.timestamp.getHours();
        hourCounts[hour]++;
      });

      return {
        totalUrges,
        urgesResisted,
        successRate,
        commonTriggers: Object.entries(triggerCounts)
          .map(([trigger, count]) => ({ trigger, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        commonUrges: Object.entries(urgeCounts)
          .map(([urge, count]) => ({ urge, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        hourlyDistribution: Object.entries(hourCounts).map(([hour, count]) => ({
          hour: parseInt(hour),
          count,
        })),
      };
    } catch (error) {
      console.error("Error calculating statistics:", error);
      return {
        totalUrges: 0,
        urgesResisted: 0,
        successRate: 0,
        commonTriggers: [],
        commonUrges: [],
        hourlyDistribution: [],
      };
    }
  }

  // User Settings
  async saveUserSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.USER_SETTINGS_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Error saving user settings:", error);
      throw error;
    }
  }

  async getUserSettings(): Promise<UserSettings> {
    try {
      const settings = await AsyncStorage.getItem(this.USER_SETTINGS_KEY);
      if (settings) {
        return JSON.parse(settings);
      }

      // Default settings
      return {
        notificationsEnabled: true,
        dailyReminderTime: "20:00",
        selectedReplacementActions: [],
        streakGoals: [],
      };
    } catch (error) {
      console.error("Error getting user settings:", error);
      return {
        notificationsEnabled: true,
        dailyReminderTime: "20:00",
        selectedReplacementActions: [],
        streakGoals: [],
      };
    }
  }

  // Streaks Management
  async updateStreak(category: string, success: boolean): Promise<void> {
    try {
      const settings = await this.getUserSettings();
      const streakGoal = settings.streakGoals.find(
        (goal) => goal.category === category
      );

      if (streakGoal) {
        if (success) {
          streakGoal.currentStreak++;
        } else {
          streakGoal.currentStreak = 0;
        }

        await this.saveUserSettings(settings);
      }
    } catch (error) {
      console.error("Error updating streak:", error);
      throw error;
    }
  }

  async getStreakData(): Promise<StreakGoal[]> {
    try {
      const settings = await this.getUserSettings();
      return settings.streakGoals;
    } catch (error) {
      console.error("Error getting streak data:", error);
      return [];
    }
  }

  // Export data (for backup or analysis)
  async exportData(): Promise<string> {
    try {
      const logs = await this.getAllUrgeLogs();
      const settings = await this.getUserSettings();

      const exportData = {
        logs,
        settings,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  }

  // Clear all data (for testing or reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.URGE_LOGS_KEY,
        this.USER_SETTINGS_KEY,
        this.STREAKS_KEY,
      ]);
    } catch (error) {
      console.error("Error clearing data:", error);
      throw error;
    }
  }

  // Get recent successful replacements for motivation
  async getRecentWins(limit: number = 10): Promise<UrgeLog[]> {
    try {
      const logs = await this.getAllUrgeLogs();
      return logs
        .filter((log) => !log.actedOn && log.replacementAction)
        .slice(0, limit);
    } catch (error) {
      console.error("Error getting recent wins:", error);
      return [];
    }
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();

// Utility functions for common operations
export const logUrge = async (urgeData: Omit<UrgeLog, "id" | "timestamp">) => {
  const log: UrgeLog = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    timestamp: new Date(),
    ...urgeData,
  };

  await storageService.saveUrgeLog(log);
  return log;
};

export const getWeeklyStats = () => storageService.getUrgeStatistics(7);
export const getMonthlyStats = () => storageService.getUrgeStatistics(30);
export const getAllTimeStats = () => storageService.getUrgeStatistics(365 * 10); // 10 years

export default storageService;
