export const APP_THEME = {
  colors: {
    // Primary brand colors (matching onboarding)
    primary: "#185e66", // Dark teal from onboarding
    primaryLight: "#2d7a84", // Lighter variant
    primaryDark: "#0f4a52", // Darker variant

    // Accent colors
    accent: "#10B981", // Green from progress bar
    accentLight: "#34D399",
    accentDark: "#059669",

    // Background colors
    background: "#185e66", // Main background
    surface: "#ffffff", // Card backgrounds
    surfaceLight: "#f8fafc", // Light surface
    surfaceDark: "rgba(255, 255, 255, 0.1)", // Dark surface with opacity

    // Text colors
    onPrimary: "#ffffff", // White text on primary
    onSurface: "#185e66", // Dark teal text on white
    textSecondary: "rgba(255, 255, 255, 0.75)", // Semi-transparent white
    textMuted: "rgba(255, 255, 255, 0.5)", // More transparent white

    // Status colors
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",

    // Border colors
    border: "rgba(255, 255, 255, 0.2)",
    borderLight: "#e5e7eb",
  },

  gradients: {
    primary: "linear-gradient(135deg, #185e66 0%, #2d7a84 100%)",
    accent: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    surface:
      "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },

  borderRadius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },

  typography: {
    // Matching onboarding text styles
    hero: {
      fontSize: "36px",
      fontWeight: "bold",
      lineHeight: "1.2",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      lineHeight: "1.3",
    },
    subtitle: {
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "1.4",
    },
    body: {
      fontSize: "16px",
      fontWeight: "400",
      lineHeight: "1.5",
    },
    caption: {
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "1.4",
    },
  },
} as const;
