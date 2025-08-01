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
  "Drink caffeine",
  "Scroll social media",
  "Drink alcohol",
  "Vape",
  "Eat junk food",
  "Smoke weed",
  "Watch porn",
  "Play video games",
  "Gamble",
  "Online Shopping",
  "Use phone",
  "Watch TV",
  "Smoke cigarettes",
  "Drink soda",
  "Have sex",
  "Bite nails",
] as const;

export const COMMON_TRIGGERS = [
  "Boredom",
  "Stress",
  "Loneliness",
  "Anxiety",
  "Notification",
  "Advertisement",
  "Habit",
  "Procrastination",
  "Sadness",
  "Anger",
  "FOMO",
  "Peer pressure",
  "Celebration",
  "Fatigue",
  "Hunger",
] as const;

export const COMMON_LOCATIONS = [
  "Home",
  "Work",
  "Gym",
  "Commuting",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Car",
  "Friend's house",
  "Restaurant",
  "Store",
  "School",
  "Outside",
] as const;

export const COMMON_EMOTIONS = [
  "Anxious",
  "Stressed",
  "Bored",
  "Sad",
  "Angry",
  "Lonely",
  "Frustrated",
  "Overwhelmed",
  "Excited",
  "Happy",
  "Tired",
  "Restless",
  "Guilty",
  "Ashamed",
  "Confident",
  "Insecure",
  "Content",
  "Nervous",
  "Disappointed",
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
