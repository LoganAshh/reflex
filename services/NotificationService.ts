import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { storageService } from "./StorageService";

// Configure how notifications should be handled when app is running
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  private static instance: NotificationService;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log("Must use physical device for Push Notifications");
      return false;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("reflex-reminders", {
        name: "Reflex Reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#3B82F6",
      });
    }

    return true;
  }

  async scheduleDailyCheckIn(
    hour: number = 20,
    minute: number = 0
  ): Promise<void> {
    try {
      // Cancel existing daily check-in
      await this.cancelDailyCheckIn();

      // Schedule new daily reminder
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Check-in 🌟",
          body: "How did today go? Take a moment to reflect on your progress.",
          data: { type: "daily_checkin" },
        },
        trigger: {
          hour,
          minute,
          repeats: true,
        },
      });

      console.log(
        "Daily check-in scheduled for",
        `${hour}:${minute.toString().padStart(2, "0")}`
      );
    } catch (error) {
      console.error("Error scheduling daily check-in:", error);
    }
  }

  async cancelDailyCheckIn(): Promise<void> {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      const dailyCheckInNotifications = scheduledNotifications.filter(
        (notification) => notification.content.data?.type === "daily_checkin"
      );

      for (const notification of dailyCheckInNotifications) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
      }
    } catch (error) {
      console.error("Error canceling daily check-in:", error);
    }
  }

  async scheduleUrgeReminder(delayMinutes: number = 30): Promise<void> {
    try {
      const motivationalMessages = [
        "Remember your goals! 💪",
        "You've got this! Stay strong 🌟",
        "Take a deep breath and choose mindfully 🧘",
        "Your future self will thank you ✨",
        "Progress over perfection 🚀",
      ];

      const randomMessage =
        motivationalMessages[
          Math.floor(Math.random() * motivationalMessages.length)
        ];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Mindful Moment",
          body: randomMessage,
          data: { type: "urge_reminder" },
        },
        trigger: {
          seconds: delayMinutes * 60,
        },
      });
    } catch (error) {
      console.error("Error scheduling urge reminder:", error);
    }
  }

  async sendSuccessNotification(streakCount: number): Promise<void> {
    try {
      let title = "Great job! 🎉";
      let body = "";

      if (streakCount === 1) {
        body = "You successfully resisted an urge! Every step counts.";
      } else if (streakCount < 7) {
        body = `${streakCount} urges resisted! You\'re building momentum.`;
      } else if (streakCount < 30) {
        body = `${streakCount} day streak! You\'re creating lasting change.`;
      } else {
        body = `Amazing! ${streakCount} days of mindful choices. You\'re an inspiration!`;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { type: "success_celebration" },
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error("Error sending success notification:", error);
    }
  }

  async scheduleWeeklyReflection(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Weekly Reflection 📈",
          body: "Check out your weekly progress and insights!",
          data: { type: "weekly_reflection" },
        },
        trigger: {
          weekday: 1, // Monday
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });
    } catch (error) {
      console.error("Error scheduling weekly reflection:", error);
    }
  }

  async scheduleBreakTime(minutes: number = 60): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Take a Break 🌿",
          body: "You've been doing great! Time for a mindful break.",
          data: { type: "break_reminder" },
        },
        trigger: {
          seconds: minutes * 60,
        },
      });
    } catch (error) {
      console.error("Error scheduling break reminder:", error);
    }
  }

  async handleNotificationResponse(
    response: Notifications.NotificationResponse
  ): Promise<void> {
    const { type } = response.notification.request.content.data || {};

    switch (type) {
      case "daily_checkin":
        // Navigate to daily check-in
        console.log("User tapped daily check-in notification");
        break;

      case "urge_reminder":
        // Navigate to quick log
        console.log("User tapped urge reminder notification");
        break;

      case "weekly_reflection":
        // Navigate to patterns/analytics
        console.log("User tapped weekly reflection notification");
        break;

      default:
        console.log("Unknown notification type:", type);
    }
  }

  async updateNotificationSettings(): Promise<void> {
    try {
      const settings = await storageService.getUserSettings();

      if (settings.notificationsEnabled) {
        // Enable notifications based on user settings
        await this.requestPermissions();

        // Parse reminder time (e.g., "20:00")
        const [hour, minute] = settings.dailyReminderTime
          .split(":")
          .map(Number);
        await this.scheduleDailyCheckIn(hour, minute);
        await this.scheduleWeeklyReflection();
      } else {
        // Disable all notifications
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  }

  async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All notifications canceled");
    } catch (error) {
      console.error("Error canceling all notifications:", error);
    }
  }

  // Initialize notification listeners
  setupNotificationListeners(): void {
    // Handle notification response when user taps notification
    Notifications.addNotificationResponseReceivedListener(
      this.handleNotificationResponse
    );

    // Handle notification received while app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received while app is open:", notification);
    });
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Utility functions
export const setupNotifications = async (): Promise<boolean> => {
  const hasPermission = await notificationService.requestPermissions();
  if (hasPermission) {
    notificationService.setupNotificationListeners();
    await notificationService.updateNotificationSettings();
  }
  return hasPermission;
};

export const celebrateSuccess = async (streakCount: number): Promise<void> => {
  await notificationService.sendSuccessNotification(streakCount);
};

export const scheduleMotivationalReminder = async (
  delayMinutes: number = 30
): Promise<void> => {
  await notificationService.scheduleUrgeReminder(delayMinutes);
};

export default notificationService;
