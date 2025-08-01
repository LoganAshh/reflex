// types/index.ts

export interface UrgeLog {
  id: string;
  urge: string;
  location: string;
  trigger: string;
  emotion?: string; // Added emotion field
  actedOn: boolean;
  timestamp: Date;
  replacementAction?: string;
  notes?: string;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  dailyReminderTime: string; // Format: "HH:MM"
  selectedReplacementActions: string[];
  streakGoals: StreakGoal[];
  onboardingCompleted: boolean;
  theme: "light" | "dark" | "system";
  selectedUrges: string[]; // New field for storing user's selected urges for tracking
  recentTriggers?: string[]; // Recently used triggers, ordered by most recent first
  recentLocations?: string[]; // Recently used locations, ordered by most recent first
  recentEmotions?: string[]; // Recently used emotions, ordered by most recent first
}

export interface StreakGoal {
  id: string;
  title: string;
  targetDays: number;
  currentStreak: number;
  category: string;
  color: string;
  isActive: boolean;
}

export interface ReplacementAction {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: "mindful" | "physical" | "social" | "creative" | "productive";
  icon: string;
  difficulty: "easy" | "medium" | "hard";
  timesUsed: number;
  effectiveness?: number; // 1-5 rating
}

export interface DashboardStats {
  totalUrges: number;
  urgesResisted: number;
  successRate: number;
  commonTriggers: { trigger: string; count: number }[];
  commonUrges: { urge: string; count: number }[];
  commonEmotions?: { emotion: string; count: number }[]; // Made optional for backward compatibility
  hourlyHeatmap: { hour: number; count: number }[];
  weeklyTrend: { day: string; count: number; date: string }[];
  averageUrgesPerDay: number;
  longestStreak: number;
  currentStreak: number;
}

export interface NotificationSettings {
  enabled: boolean;
  dailyCheckIn: {
    enabled: boolean;
    time: string; // "HH:MM" format
  };
  urgeReminder: {
    enabled: boolean;
    intervalMinutes: number; // Check-in reminder after X minutes of no activity
  };
  motivational: {
    enabled: boolean;
    frequency: "daily" | "weekly" | "never";
  };
}

export interface AIInsight {
  id: string;
  type: "pattern" | "suggestion" | "celebration" | "warning";
  title: string;
  message: string;
  actionable: boolean;
  suggestedActions?: string[];
  timestamp: Date;
  dismissed: boolean;
}

export interface ExportData {
  logs: UrgeLog[];
  settings: UserSettings;
  replacementActions: ReplacementAction[];
  exportDate: string;
  version: string;
  totalDays: number;
  summary: DashboardStats;
}

// Navigation types
export type RootTabParamList = {
  Log: undefined;
  Patterns: undefined;
  Actions: undefined;
  Streaks: undefined;
  Settings: undefined;
};

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface HeatmapDataPoint {
  hour: number;
  count: number;
  intensity: number; // 0-1 normalized value
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

// FIXED: Form data type for the UI (allows null during form completion)
export interface LogFormData {
  urge: string;
  location: string;
  trigger: string;
  emotion?: string;
  actedOn: boolean | null; // null during form completion
  replacementAction?: string;
  notes?: string;
}

// FIXED: Completed form data type (ready for saving)
export interface CompletedLogFormData {
  urge: string;
  location: string;
  trigger: string;
  emotion?: string;
  actedOn: boolean; // must be boolean when saving
  replacementAction?: string;
  notes?: string;
}

// Storage keys
export const STORAGE_KEYS = {
  URGE_LOGS: "urge_logs",
  USER_SETTINGS: "user_settings",
  REPLACEMENT_ACTIONS: "replacement_actions",
  STREAKS: "streaks",
  AI_INSIGHTS: "ai_insights",
  ONBOARDING: "onboarding_completed",
} as const;

// Common urges, triggers, locations, and emotions for quick selection
export const COMMON_URGES = [
  {
    text: "Drink caffeine",
    icon: "cafe-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Scroll social media",
    icon: "phone-portrait-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Drink alcohol",
    icon: "wine-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Vape",
    icon: "cloud-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Eat junk food",
    icon: "fast-food-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Smoke weed",
    icon: "leaf-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Watch porn",
    icon: "eye-off-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Play video games",
    icon: "game-controller-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Gamble",
    icon: "dice-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Online Shopping",
    icon: "bag-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Use phone",
    icon: "phone-portrait-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Watch TV",
    icon: "tv-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Smoke cigarettes",
    icon: "ban-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Drink soda",
    icon: "restaurant-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Have sex",
    icon: "heart-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Bite nails",
    icon: "hand-left-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
] as const;

export const COMMON_TRIGGERS = [
  {
    text: "Boredom",
    icon: "time-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Stress",
    icon: "warning-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Loneliness",
    icon: "person-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Anxiety",
    icon: "pulse-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Notification",
    icon: "notifications-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Advertisement",
    icon: "megaphone-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Habit",
    icon: "refresh-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Procrastination",
    icon: "hourglass-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Sadness",
    icon: "sad-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Anger",
    icon: "flame-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "FOMO",
    icon: "eye-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Peer pressure",
    icon: "people-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Celebration",
    icon: "trophy-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Fatigue",
    icon: "battery-dead-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Hunger",
    icon: "restaurant-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
] as const;

export const COMMON_LOCATIONS = [
  {
    text: "Home",
    icon: "home-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Work",
    icon: "briefcase-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Gym",
    icon: "fitness-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Commuting",
    icon: "car-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Bedroom",
    icon: "bed-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Kitchen",
    icon: "restaurant-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Bathroom",
    icon: "water-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Car",
    icon: "car-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Friend's house",
    icon: "people-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Restaurant",
    icon: "restaurant-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Store",
    icon: "storefront-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "School",
    icon: "school-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Outside",
    icon: "sunny-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
] as const;

export const COMMON_EMOTIONS = [
  {
    text: "Anxious",
    icon: "pulse-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Stressed",
    icon: "warning-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Bored",
    icon: "time-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Sad",
    icon: "sad-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Angry",
    icon: "flame-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Lonely",
    icon: "person-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Frustrated",
    icon: "close-circle-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Overwhelmed",
    icon: "thunderstorm-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Excited",
    icon: "star-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Happy",
    icon: "happy-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Tired",
    icon: "moon-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Restless",
    icon: "walk-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Guilty",
    icon: "shield-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Ashamed",
    icon: "eye-off-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Confident",
    icon: "ribbon-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Insecure",
    icon: "help-circle-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Content",
    icon: "checkmark-circle-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Nervous",
    icon: "flash-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
  {
    text: "Disappointed",
    icon: "arrow-down-outline" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
  },
] as const;

// Color schemes for charts and UI
export const COLORS = {
  primary: "#3B82F6", // blue-500
  success: "#10B981", // green-500
  warning: "#F59E0B", // yellow-500
  danger: "#EF4444", // red-500
  info: "#8B5CF6", // purple-500
  gray: "#6B7280", // gray-500
} as const;

export type CommonUrge = (typeof COMMON_URGES)[number];
export type CommonTrigger = (typeof COMMON_TRIGGERS)[number];
export type CommonLocation = (typeof COMMON_LOCATIONS)[number];
export type CommonEmotion = (typeof COMMON_EMOTIONS)[number];
