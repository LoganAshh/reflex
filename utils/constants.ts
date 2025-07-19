export const APP_CONFIG = {
  APP_NAME: "Reflex",
  VERSION: "1.0.0",
  AUTHOR: "Built with ❤️ for mindful living",
} as const;

export const COLORS = {
  primary: "#3B82F6", // blue-500
  success: "#10B981", // green-500
  warning: "#F59E0B", // yellow-500
  danger: "#EF4444", // red-500
  info: "#8B5CF6", // purple-500
  gray: "#6B7280", // gray-500
  background: "#F9FAFB", // gray-50
  surface: "#FFFFFF", // white
  text: "#111827", // gray-900
  textSecondary: "#6B7280", // gray-500
} as const;

export const REPLACEMENT_ACTION_CATEGORIES = [
  { id: "all", label: "All", icon: "🌟" },
  { id: "mindful", label: "Mindful", icon: "🧘" },
  { id: "physical", label: "Physical", icon: "🏃" },
  { id: "social", label: "Social", icon: "👥" },
  { id: "creative", label: "Creative", icon: "🎨" },
  { id: "productive", label: "Productive", icon: "✅" },
] as const;

export const DIFFICULTY_COLORS = {
  easy: { text: "text-green-600", bg: "bg-green-100" },
  medium: { text: "text-yellow-600", bg: "bg-yellow-100" },
  hard: { text: "text-red-600", bg: "bg-red-100" },
} as const;

export const MOTIVATIONAL_QUOTES = [
  "You're rewiring your brain with every urge you resist! 🧠",
  "Small steps lead to big changes. Keep going! 🚶‍♂️",
  "Awareness is the first step to transformation. 🌟",
  "Your future self will thank you for this moment. 🙏",
  "Progress, not perfection. You're doing great! 💪",
  "Every 'no' to an urge is a 'yes' to your goals. ✨",
  "You have the power to choose your response. 🦾",
  "Building better habits, one urge at a time. 🔨",
] as const;

export const TIME_RANGES = {
  WEEK: 7,
  MONTH: 30,
  QUARTER: 90,
  YEAR: 365,
} as const;

// src/utils/dateUtils.ts

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return formatDate(date);
};

export const getTimeOfDay = (date: Date): string => {
  const hour = date.getHours();
  if (hour < 6) return "Late Night";
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  if (hour < 21) return "Evening";
  return "Night";
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

export const getWeekStart = (date: Date = new Date()): Date => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day;
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getMonthStart = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// src/utils/validation.ts

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateUrgeLog = (data: {
  urge: string;
  location: string;
  trigger: string;
  actedOn: boolean | null;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.urge.trim()) {
    errors.push("Please describe the urge you felt");
  }

  if (data.urge.length > 200) {
    errors.push("Urge description must be less than 200 characters");
  }

  if (data.location.length > 100) {
    errors.push("Location must be less than 100 characters");
  }

  if (data.trigger.length > 150) {
    errors.push("Trigger description must be less than 150 characters");
  }

  if (data.actedOn === null) {
    errors.push("Please indicate whether you acted on the urge");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateStreakGoal = (data: {
  title: string;
  targetDays: number;
  category: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.title.trim()) {
    errors.push("Goal title is required");
  }

  if (data.title.length > 50) {
    errors.push("Goal title must be less than 50 characters");
  }

  if (data.targetDays < 1 || data.targetDays > 365) {
    errors.push("Target days must be between 1 and 365");
  }

  if (!data.category.trim()) {
    errors.push("Category is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// src/utils/analytics.ts

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

export const generateInsight = (stats: {
  totalUrges: number;
  successRate: number;
  commonTriggers: { trigger: string; count: number }[];
  hourlyHeatmap: { hour: number; count: number }[];
}): string[] => {
  const insights: string[] = [];

  // Success rate insights
  if (stats.successRate >= 70) {
    insights.push("🎉 Excellent self-control! You're resisting most urges.");
  } else if (stats.successRate >= 50) {
    insights.push("💪 Good progress! You're building stronger willpower.");
  } else if (stats.successRate >= 30) {
    insights.push("📈 Keep going! Awareness is the first step to change.");
  } else {
    insights.push(
      "🌱 Every journey starts with a single step. You're building awareness!"
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
