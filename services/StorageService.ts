import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  UrgeLog,
  UserSettings,
  StreakGoal,
  DashboardStats,
  ReplacementAction,
  AIInsight,
  ExportData,
  STORAGE_KEYS,
} from "../types";

class StorageService {
  private static instance: StorageService;

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic storage methods
  private async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw new Error(`Failed to save ${key}`);
    }
  }

  private async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Convert timestamp strings back to Date objects for logs
        if (key === STORAGE_KEYS.URGE_LOGS && Array.isArray(parsed)) {
          return parsed.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          })) as T;
        }
        return parsed;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return defaultValue;
    }
  }

  // Urge Logs Management
  async saveUrgeLog(log: UrgeLog): Promise<void> {
    const existingLogs = await this.getAllUrgeLogs();
    const updatedLogs = [log, ...existingLogs];
    await this.setItem(STORAGE_KEYS.URGE_LOGS, updatedLogs);

    // Update streak data when logging
    await this.updateStreakProgress(log);
  }

  async getAllUrgeLogs(): Promise<UrgeLog[]> {
    return this.getItem<UrgeLog[]>(STORAGE_KEYS.URGE_LOGS, []);
  }

  async getUrgeLogsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<UrgeLog[]> {
    const allLogs = await this.getAllUrgeLogs();
    return allLogs.filter(
      (log) => log.timestamp >= startDate && log.timestamp <= endDate
    );
  }

  async updateUrgeLog(updatedLog: UrgeLog): Promise<void> {
    const logs = await this.getAllUrgeLogs();
    const index = logs.findIndex((log) => log.id === updatedLog.id);
    if (index !== -1) {
      logs[index] = updatedLog;
      await this.setItem(STORAGE_KEYS.URGE_LOGS, logs);
    }
  }

  async deleteUrgeLog(logId: string): Promise<void> {
    const logs = await this.getAllUrgeLogs();
    const filteredLogs = logs.filter((log) => log.id !== logId);
    await this.setItem(STORAGE_KEYS.URGE_LOGS, filteredLogs);
  }

  // User Settings
  async saveUserSettings(settings: UserSettings): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_SETTINGS, settings);
  }

  async getUserSettings(): Promise<UserSettings> {
    return this.getItem<UserSettings>(STORAGE_KEYS.USER_SETTINGS, {
      notificationsEnabled: true,
      dailyReminderTime: "20:00",
      selectedReplacementActions: [],
      streakGoals: this.getDefaultStreakGoals(),
      onboardingCompleted: false,
      theme: "system",
      selectedUrges: [], // Default to empty array - user will select during onboarding
    });
  }

  private getDefaultStreakGoals(): StreakGoal[] {
    return [
      {
        id: "1",
        title: "No social media scrolling",
        targetDays: 30,
        currentStreak: 0,
        category: "digital_wellness",
        color: "#3B82F6",
        isActive: true,
      },
      {
        id: "2",
        title: "Mindful eating",
        targetDays: 14,
        currentStreak: 0,
        category: "health",
        color: "#10B981",
        isActive: true,
      },
    ];
  }

  // Analytics and Statistics
  async getUrgeStatistics(days: number = 30): Promise<DashboardStats> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.getUrgeLogsByDateRange(startDate, endDate);

    const totalUrges = logs.length;
    const urgesResisted = logs.filter((log) => !log.actedOn).length;
    const successRate =
      totalUrges > 0 ? Math.round((urgesResisted / totalUrges) * 100) : 0;

    // Calculate common triggers
    const triggerCounts: { [key: string]: number } = {};
    logs.forEach((log) => {
      if (log.trigger) {
        triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1;
      }
    });

    // Calculate common urges
    const urgeCounts: { [key: string]: number } = {};
    logs.forEach((log) => {
      urgeCounts[log.urge] = (urgeCounts[log.urge] || 0) + 1;
    });

    // Calculate hourly distribution
    const hourCounts: { [key: number]: number } = {};
    for (let i = 0; i < 24; i++) {
      hourCounts[i] = 0;
    }
    logs.forEach((log) => {
      const hour = log.timestamp.getHours();
      hourCounts[hour]++;
    });

    // Calculate weekly trend
    const weeklyTrend = this.calculateWeeklyTrend(logs, startDate, endDate);

    // Calculate streaks
    const streakData = await this.calculateCurrentStreak();

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
      hourlyHeatmap: Object.entries(hourCounts).map(([hour, count]) => ({
        hour: parseInt(hour),
        count,
      })),
      weeklyTrend,
      averageUrgesPerDay: totalUrges / Math.max(days, 1),
      longestStreak: streakData.longest,
      currentStreak: streakData.current,
    };
  }

  private calculateWeeklyTrend(
    logs: UrgeLog[],
    startDate: Date,
    endDate: Date
  ) {
    const dailyCounts: { [key: string]: number } = {};

    // Initialize all days in range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      dailyCounts[dateString] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Count logs per day
    logs.forEach((log) => {
      const dateString = log.timestamp.toISOString().split("T")[0];
      dailyCounts[dateString] = (dailyCounts[dateString] || 0) + 1;
    });

    // Get last 7 days
    const last7Days = Object.entries(dailyCounts)
      .slice(-7)
      .map(([date, count]) => {
        const dayName = new Date(date).toLocaleDateString("en", {
          weekday: "short",
        });
        return { day: dayName, count, date };
      });

    return last7Days;
  }

  private async calculateCurrentStreak(): Promise<{
    current: number;
    longest: number;
  }> {
    const logs = await this.getAllUrgeLogs();
    const sortedLogs = logs
      .filter((log) => !log.actedOn) // Only count resisted urges
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    sortedLogs.forEach((log) => {
      const logDate = new Date(log.timestamp.toDateString());

      if (!lastDate) {
        tempStreak = 1;
        currentStreak = 1;
      } else {
        const daysDiff = Math.floor(
          (lastDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          tempStreak++;
          if (
            lastDate.toDateString() === new Date().toDateString() ||
            lastDate.toDateString() ===
              new Date(Date.now() - 86400000).toDateString()
          ) {
            currentStreak = tempStreak;
          }
        } else {
          tempStreak = 1;
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);
      lastDate = logDate;
    });

    return { current: currentStreak, longest: longestStreak };
  }

  // Streak Management
  private async updateStreakProgress(log: UrgeLog): Promise<void> {
    if (!log.actedOn) {
      // User resisted the urge, potentially extend streak
      const settings = await this.getUserSettings();
      const relevantGoals = settings.streakGoals.filter(
        (goal) => goal.isActive
      );

      // Simple streak logic - can be made more sophisticated
      relevantGoals.forEach((goal) => {
        goal.currentStreak++;
      });

      await this.saveUserSettings(settings);
    }
  }

  // Replacement Actions
  async getReplacementActions(): Promise<ReplacementAction[]> {
    return this.getItem<ReplacementAction[]>(
      STORAGE_KEYS.REPLACEMENT_ACTIONS,
      this.getDefaultReplacementActions()
    );
  }

  async updateReplacementAction(action: ReplacementAction): Promise<void> {
    const actions = await this.getReplacementActions();
    const index = actions.findIndex((a) => a.id === action.id);
    if (index !== -1) {
      actions[index] = action;
      await this.setItem(STORAGE_KEYS.REPLACEMENT_ACTIONS, actions);
    }
  }

  async recordReplacementActionUsage(
    actionId: string,
    effectiveness?: number
  ): Promise<void> {
    const actions = await this.getReplacementActions();
    const action = actions.find((a) => a.id === actionId);
    if (action) {
      action.timesUsed++;
      if (effectiveness) {
        action.effectiveness = effectiveness;
      }
      await this.setItem(STORAGE_KEYS.REPLACEMENT_ACTIONS, actions);
    }
  }

  private getDefaultReplacementActions(): ReplacementAction[] {
    return [
      // 🧘 Mindful Actions
      {
        id: "mindful-1",
        title: "Box Breathing",
        description: "Breathe in 4s, hold 4s, out 4s, hold 4s",
        duration: "2 min",
        category: "mindful",
        icon: "🌬️",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "mindful-2",
        title: "Body Scan Meditation",
        description: "Tune in to sensations from head to toe",
        duration: "5-10 min",
        category: "mindful",
        icon: "🧘",
        difficulty: "medium",
        timesUsed: 0,
      },
      {
        id: "mindful-3",
        title: "Gratitude List",
        description: "Write down 3 things you're grateful for",
        duration: "3-5 min",
        category: "mindful",
        icon: "📝",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "mindful-4",
        title: "Mindful Sip",
        description: "Drink water slowly and focus on the experience",
        duration: "1-2 min",
        category: "mindful",
        icon: "💧",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "mindful-5",
        title: "Name That Emotion",
        description: "Pause and label what you're feeling",
        duration: "1-2 min",
        category: "mindful",
        icon: "🎭",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "mindful-6",
        title: "5-4-3-2-1 Grounding",
        description: "Identify 5 things you can see, 4 you can touch, etc.",
        duration: "3-5 min",
        category: "mindful",
        icon: "👀",
        difficulty: "easy",
        timesUsed: 0,
      },

      // 🏃 Physical Actions
      {
        id: "physical-1",
        title: "Walk Around the Block",
        description: "Step outside, breathe fresh air",
        duration: "10 min",
        category: "physical",
        icon: "🚶",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "physical-2",
        title: "10 Push-ups or Jumping Jacks",
        description: "Quick burst of movement",
        duration: "2-3 min",
        category: "physical",
        icon: "💪",
        difficulty: "medium",
        timesUsed: 0,
      },
      {
        id: "physical-3",
        title: "Stretch for 3 Minutes",
        description: "Loosen neck, shoulders, back",
        duration: "3 min",
        category: "physical",
        icon: "🤸",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "physical-4",
        title: "Dance to 1 Song",
        description: "Pick a fun one and move freely",
        duration: "3-4 min",
        category: "physical",
        icon: "💃",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "physical-5",
        title: "Cold Water Splash",
        description: "Reset your nervous system quickly",
        duration: "1 min",
        category: "physical",
        icon: "❄️",
        difficulty: "easy",
        timesUsed: 0,
      },

      // 👥 Social Actions
      {
        id: "social-1",
        title: "Call or Text a Friend",
        description: "Just check in or say hi",
        duration: "2-10 min",
        category: "social",
        icon: "📱",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "social-2",
        title: "Compliment Someone",
        description: "Online or in-person",
        duration: "1-2 min",
        category: "social",
        icon: "💬",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "social-3",
        title: "Ask Someone a Deep Question",
        description: 'e.g. "What\'s been on your mind lately?"',
        duration: "5-15 min",
        category: "social",
        icon: "🤔",
        difficulty: "medium",
        timesUsed: 0,
      },
      {
        id: "social-4",
        title: "Send a Voice Memo",
        description: "To someone you appreciate",
        duration: "2-5 min",
        category: "social",
        icon: "🎤",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "social-5",
        title: "Check on Someone",
        description: "You haven't talked to in a while",
        duration: "5-15 min",
        category: "social",
        icon: "🤝",
        difficulty: "medium",
        timesUsed: 0,
      },

      // 🎨 Creative Actions
      {
        id: "creative-1",
        title: "Doodle or Sketch Something",
        description: "Doesn't have to be good",
        duration: "5-10 min",
        category: "creative",
        icon: "✏️",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "creative-2",
        title: "Write a One-Line Poem or Haiku",
        description: "Express yourself creatively",
        duration: "3-5 min",
        category: "creative",
        icon: "📖",
        difficulty: "medium",
        timesUsed: 0,
      },
      {
        id: "creative-3",
        title: "Take a Random Photo",
        description: "Try an artsy or weird angle",
        duration: "2-5 min",
        category: "creative",
        icon: "📸",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "creative-4",
        title: "Voice Record a Thought or Idea",
        description: "Capture your creativity",
        duration: "2-3 min",
        category: "creative",
        icon: "🎙️",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "creative-5",
        title: "Make a 30-Second Beat",
        description: "If music tools are available",
        duration: "5-10 min",
        category: "creative",
        icon: "🎵",
        difficulty: "hard",
        timesUsed: 0,
      },

      // ⚡ Productive Actions
      {
        id: "productive-1",
        title: "Tidy One Surface Nearby",
        description: "Desk, dresser, sink",
        duration: "2-5 min",
        category: "productive",
        icon: "🧹",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "productive-2",
        title: "Add 1 Thing to To-Do List",
        description: "Something you've been meaning to do",
        duration: "1-2 min",
        category: "productive",
        icon: "📋",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "productive-3",
        title: "Do a 1-Minute Email Clean-up",
        description: "Delete, archive, or respond",
        duration: "1 min",
        category: "productive",
        icon: "📧",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "productive-4",
        title: "Check Off a Tiny Task",
        description: "Something quick from your list",
        duration: "2-5 min",
        category: "productive",
        icon: "✅",
        difficulty: "easy",
        timesUsed: 0,
      },
      {
        id: "productive-5",
        title: "Look Up a Quote that Inspires You",
        description: "Find motivation for your day",
        duration: "2-3 min",
        category: "productive",
        icon: "💭",
        difficulty: "easy",
        timesUsed: 0,
      },
    ];
  }

  // Data Export/Import
  async exportData(): Promise<ExportData> {
    const logs = await this.getAllUrgeLogs();
    const settings = await this.getUserSettings();
    const replacementActions = await this.getReplacementActions();
    const stats = await this.getUrgeStatistics(365); // Last year

    return {
      logs,
      settings,
      replacementActions,
      exportDate: new Date().toISOString(),
      version: "1.0",
      totalDays: Math.floor(
        (Date.now() - Math.min(...logs.map((l) => l.timestamp.getTime()))) /
          (1000 * 60 * 60 * 24)
      ),
      summary: stats,
    };
  }

  async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  }

  // Recent activity
  async getRecentWins(limit: number = 10): Promise<UrgeLog[]> {
    const logs = await this.getAllUrgeLogs();
    return logs.filter((log) => !log.actedOn).slice(0, limit);
  }

  async getTodaysLogs(): Promise<UrgeLog[]> {
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

    return this.getUrgeLogsByDateRange(startOfDay, endOfDay);
  }
}

// Export singleton instance and utility functions
export const storageService = StorageService.getInstance();

export const logUrge = async (
  urgeData: Omit<UrgeLog, "id" | "timestamp">
): Promise<UrgeLog> => {
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
export const getAllTimeStats = () => storageService.getUrgeStatistics(365);

export default storageService;
