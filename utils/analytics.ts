import { DashboardStats, UrgeLog } from "../types";
import { getTimeOfDay } from "./dateUtils";

export const MOTIVATIONAL_QUOTES = [
  "You're rewiring your brain with every urge you resist! 🧠",
  "Small steps lead to big changes. Keep going! 🚶‍♂️",
  "Awareness is the first step to transformation. 🌟",
  "Your future self will thank you for this moment. 🙏",
  "Progress, not perfection. You're doing great! 💪",
  "Every 'no' to an urge is a 'yes' to your goals. ✨",
  "You have the power to choose your response. 🦾",
  "Building better habits, one urge at a time. 🔨",
  "Self-control is like a muscle - it gets stronger with practice. 💪",
  "You're not just resisting urges, you're building character. 🌱",
  "Every mindful choice shapes who you're becoming. 🦋",
  "Breaking patterns takes courage. You have it! 🦁",
  "Your willpower is stronger than your impulses. 🔥",
  "Each urge resisted is a victory worth celebrating. 🎉",
  "You're teaching your brain new, healthier responses. 🧩",
] as const;

export const calculateSuccessRate = (
  totalUrges: number,
  resistedUrges: number
): number => {
  if (totalUrges === 0) return 0;
  return Math.round((resistedUrges / totalUrges) * 100);
};

export const getMostCommonItem = <T extends { count: number }>(
  items: T[]
): T | null => {
  return items.length > 0 ? items[0] : null;
};

export const getHeatmapIntensity = (
  count: number,
  maxCount: number
): number => {
  if (maxCount === 0) return 0;
  return count / maxCount;
};

export const generateInsights = (stats: DashboardStats): string[] => {
  const insights: string[] = [];

  // Success rate insights
  if (stats.successRate >= 80) {
    insights.push("🎉 Excellent self-control! You're resisting most urges.");
  } else if (stats.successRate >= 60) {
    insights.push("💪 Good progress! You're building stronger willpower.");
  } else if (stats.successRate >= 40) {
    insights.push("📈 Keep going! Awareness is the first step to change.");
  } else if (stats.successRate >= 20) {
    insights.push(
      "🌱 Every journey starts with a single step. You're building awareness!"
    );
  } else {
    insights.push(
      "🎯 Focus on one urge type at a time. Small wins build momentum!"
    );
  }

  // Peak time insights
  const peakHour = stats.hourlyHeatmap.reduce((max, hour) =>
    hour.count > max.count ? hour : max
  );

  if (peakHour.count > 0) {
    const timeOfDay = getTimeOfDayFromHour(peakHour.hour);
    insights.push(
      `⏰ Most urges happen during ${timeOfDay}. Consider planning alternatives for this time.`
    );
  }

  // Common trigger insights
  if (stats.commonTriggers.length > 0) {
    const topTrigger = stats.commonTriggers[0];
    const percentage = Math.round((topTrigger.count / stats.totalUrges) * 100);
    insights.push(
      `🎯 ${topTrigger.trigger} triggers ${percentage}% of your urges. Try addressing this pattern first.`
    );
  }

  // Streak insights
  if (stats.currentStreak >= 7) {
    insights.push(
      `🔥 Amazing! You've maintained awareness for ${stats.currentStreak} days. You're creating lasting change!`
    );
  } else if (stats.currentStreak >= 3) {
    insights.push(
      `⭐ Great momentum! ${stats.currentStreak} days of mindful tracking builds the habit.`
    );
  }

  // Volume insights
  if (stats.averageUrgesPerDay > 10) {
    insights.push(
      "📊 You're logging many urges daily. This high awareness is the foundation for change!"
    );
  } else if (stats.averageUrgesPerDay < 2) {
    insights.push(
      "🤔 Try logging more urges, even small ones. Awareness of all impulses helps build the tracking habit."
    );
  }

  return insights;
};

const getTimeOfDayFromHour = (hour: number): string => {
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

export const getRandomMotivationalQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
};

export const calculateTrendDirection = (
  currentPeriod: number,
  previousPeriod: number
): "up" | "down" | "stable" => {
  const difference = currentPeriod - previousPeriod;
  const percentageChange =
    previousPeriod === 0 ? 0 : (difference / previousPeriod) * 100;

  if (Math.abs(percentageChange) < 5) return "stable";
  return difference > 0 ? "up" : "down";
};

export const getTrendEmoji = (direction: "up" | "down" | "stable"): string => {
  switch (direction) {
    case "up":
      return "📈";
    case "down":
      return "📉";
    case "stable":
      return "➡️";
  }
};

export const calculateConsistencyScore = (logs: UrgeLog[]): number => {
  if (logs.length === 0) return 0;

  // Group logs by date
  const logsByDate: { [date: string]: number } = {};
  logs.forEach((log) => {
    const dateKey = log.timestamp.toDateString();
    logsByDate[dateKey] = (logsByDate[dateKey] || 0) + 1;
  });

  const daysWithLogs = Object.keys(logsByDate).length;
  const totalDays = 30; // Consider last 30 days

  return Math.round((daysWithLogs / totalDays) * 100);
};

export const getUrgeFrequencyCategory = (averagePerDay: number): string => {
  if (averagePerDay < 1) return "Low";
  if (averagePerDay < 3) return "Moderate";
  if (averagePerDay < 6) return "High";
  return "Very High";
};

export const calculateMotivationLevel = (
  successRate: number,
  currentStreak: number,
  consistencyScore: number
): "low" | "medium" | "high" => {
  const score =
    successRate * 0.4 +
    Math.min(currentStreak, 30) * 2 +
    consistencyScore * 0.4;

  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
};

export const getMotivationMessage = (
  level: "low" | "medium" | "high"
): string => {
  switch (level) {
    case "high":
      return "You're crushing it! Keep up the amazing work! 🚀";
    case "medium":
      return "Good progress! Small consistent steps lead to big changes. 💪";
    case "low":
      return "Every expert was once a beginner. You're building the foundation! 🌱";
  }
};

export const analyzeUrgePatterns = (
  logs: UrgeLog[]
): {
  timePatterns: string[];
  triggerPatterns: string[];
  suggestions: string[];
} => {
  const timePatterns: string[] = [];
  const triggerPatterns: string[] = [];
  const suggestions: string[] = [];

  // Analyze time patterns
  const hourCounts: { [hour: number]: number } = {};
  logs.forEach((log) => {
    const hour = log.timestamp.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const peakHours = Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));

  peakHours.forEach((hour) => {
    const timeOfDay = getTimeOfDayFromHour(hour);
    timePatterns.push(`Most active at ${hour}:00 (${timeOfDay})`);
  });

  // Analyze trigger patterns
  const triggerCounts: { [trigger: string]: number } = {};
  logs.forEach((log) => {
    if (log.trigger) {
      triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1;
    }
  });

  Object.entries(triggerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .forEach(([trigger, count]) => {
      const percentage = Math.round((count / logs.length) * 100);
      triggerPatterns.push(`${trigger}: ${percentage}% of urges`);
    });

  // Generate suggestions
  if (peakHours.some((hour) => hour >= 20 || hour <= 6)) {
    suggestions.push("Consider a wind-down routine for late-night urges");
  }

  if (triggerCounts["Boredom"] > logs.length * 0.3) {
    suggestions.push(
      "Keep a list of engaging activities for when boredom strikes"
    );
  }

  if (triggerCounts["Stress"] > logs.length * 0.3) {
    suggestions.push(
      "Practice stress-management techniques like deep breathing"
    );
  }

  return { timePatterns, triggerPatterns, suggestions };
};

export const formatInsightText = (insight: string): string => {
  // Remove emoji from the beginning for cleaner display in some contexts
  return insight.replace(/^[^\w\s]+\s*/, "");
};

export const getSuccessRateColor = (rate: number): string => {
  if (rate >= 80) return "#10B981"; // green-500
  if (rate >= 60) return "#3B82F6"; // blue-500
  if (rate >= 40) return "#F59E0B"; // yellow-500
  return "#EF4444"; // red-500
};
