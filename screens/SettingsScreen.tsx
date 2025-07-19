import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Share,
} from "react-native";
import { useSettings } from "../hooks/useSettings";
import { storageService } from "../services/StorageService";

const SettingsScreen: React.FC = () => {
  const { settings, loading, updateSettings, toggleNotifications } =
    useSettings();
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportData = async () => {
    try {
      setExportLoading(true);
      const exportData = await storageService.exportData();
      const jsonString = JSON.stringify(exportData, null, 2);

      await Share.share({
        message: "Reflex App Data Export",
        title: "Export Data",
        url: `data:application/json;base64,${btoa(jsonString)}`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to export data");
    } finally {
      setExportLoading(false);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your urge logs, settings, and streak data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            try {
              await storageService.clearAllData();
              Alert.alert("Success", "All data has been cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
            }
          },
        },
      ]
    );
  };

  const handleSetReminderTime = () => {
    // In a real app, you'd show a time picker
    Alert.alert("Daily Reminder", "Set your daily check-in reminder time", [
      { text: "Cancel", style: "cancel" },
      {
        text: "8:00 PM",
        onPress: () => updateSettings({ dailyReminderTime: "20:00" }),
      },
      {
        text: "9:00 PM",
        onPress: () => updateSettings({ dailyReminderTime: "21:00" }),
      },
      {
        text: "10:00 PM",
        onPress: () => updateSettings({ dailyReminderTime: "22:00" }),
      },
    ]);
  };

  const renderSettingItem = (
    title: string,
    subtitle: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode,
    icon?: string
  ) => (
    <TouchableOpacity
      className="bg-white p-4 mb-2 rounded-lg shadow-sm flex-row items-center"
      onPress={onPress}
      disabled={!onPress}
    >
      {icon && <Text className="text-2xl mr-3">{icon}</Text>}
      <View className="flex-1">
        <Text className="text-gray-800 font-medium text-lg">{title}</Text>
        <Text className="text-gray-600 text-sm mt-1">{subtitle}</Text>
      </View>
      {rightComponent && <View className="ml-3">{rightComponent}</View>}
      {onPress && !rightComponent && (
        <Text className="text-blue-500 text-lg">›</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Loading settings...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Settings</Text>
        <Text className="text-gray-600 mt-1">Customize your experience</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Notifications Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🔔 Notifications
          </Text>

          {renderSettingItem(
            "Push Notifications",
            "Get reminders and motivational messages",
            undefined,
            <Switch
              value={settings?.notificationsEnabled || false}
              onValueChange={toggleNotifications}
              trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
              thumbColor={
                settings?.notificationsEnabled ? "#ffffff" : "#ffffff"
              }
            />,
            "📱"
          )}

          {settings?.notificationsEnabled &&
            renderSettingItem(
              "Daily Reminder",
              `Check-in reminder at ${settings.dailyReminderTime}`,
              handleSetReminderTime,
              undefined,
              "⏰"
            )}
        </View>

        {/* App Preferences */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            ⚙️ Preferences
          </Text>

          {renderSettingItem(
            "Theme",
            "Choose your preferred appearance",
            () => {
              Alert.alert("Theme", "Choose your preferred theme", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Light",
                  onPress: () => updateSettings({ theme: "light" }),
                },
                {
                  text: "Dark",
                  onPress: () => updateSettings({ theme: "dark" }),
                },
                {
                  text: "System",
                  onPress: () => updateSettings({ theme: "system" }),
                },
              ]);
            },
            undefined,
            "🎨"
          )}

          {renderSettingItem(
            "Quick Actions",
            `${settings?.selectedReplacementActions.length || 0} favorite replacement actions`,
            () => {
              // Navigate to replacement actions customization
              Alert.alert(
                "Info",
                "This would open replacement actions customization"
              );
            },
            undefined,
            "⚡"
          )}
        </View>

        {/* Data & Privacy */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🔒 Data & Privacy
          </Text>

          {renderSettingItem(
            "Export Data",
            "Download all your urge logs and statistics",
            handleExportData,
            exportLoading ? (
              <Text className="text-gray-500">Exporting...</Text>
            ) : undefined,
            "📤"
          )}

          {renderSettingItem(
            "Privacy Policy",
            "Learn how we protect your data",
            () => {
              Alert.alert(
                "Privacy Policy",
                "All your data is stored locally on your device. We never collect or share your personal information."
              );
            },
            undefined,
            "🛡️"
          )}
        </View>

        {/* Streak Management */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🔥 Streaks
          </Text>

          {renderSettingItem(
            "Manage Streak Goals",
            `${settings?.streakGoals.length || 0} active goals`,
            () => {
              Alert.alert("Info", "This would open streak goal management");
            },
            undefined,
            "🎯"
          )}

          {renderSettingItem(
            "Reset Streaks",
            "Start fresh with all streak counters",
            () => {
              Alert.alert(
                "Reset Streaks",
                "This will reset all your streak counters to zero. This action cannot be undone.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                      if (settings) {
                        const updatedGoals = settings.streakGoals.map(
                          (goal) => ({
                            ...goal,
                            currentStreak: 0,
                          })
                        );
                        await updateSettings({ streakGoals: updatedGoals });
                        Alert.alert("Success", "All streaks have been reset");
                      }
                    },
                  },
                ]
              );
            },
            undefined,
            "🔄"
          )}
        </View>

        {/* Support & Feedback */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            💬 Support
          </Text>

          {renderSettingItem(
            "Send Feedback",
            "Help us improve the app",
            () => {
              Alert.alert("Send Feedback", "What would you like to tell us?", [
                { text: "Cancel", style: "cancel" },
                { text: "Report Bug", onPress: () => {} },
                { text: "Feature Request", onPress: () => {} },
                { text: "General Feedback", onPress: () => {} },
              ]);
            },
            undefined,
            "📝"
          )}

          {renderSettingItem(
            "Rate the App",
            "Leave a review on the App Store",
            () => {
              Alert.alert(
                "Thank you!",
                "This would open the App Store rating page"
              );
            },
            undefined,
            "⭐"
          )}
        </View>

        {/* Danger Zone */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-red-600 mb-3">
            ⚠️ Danger Zone
          </Text>

          <TouchableOpacity
            className="bg-red-50 p-4 rounded-lg border border-red-200"
            onPress={handleClearData}
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">🗑️</Text>
              <View className="flex-1">
                <Text className="text-red-800 font-medium text-lg">
                  Clear All Data
                </Text>
                <Text className="text-red-600 text-sm mt-1">
                  Permanently delete all logs, settings, and streaks
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="items-center mb-8">
          <Text className="text-gray-500 text-sm">Reflex v1.0.0</Text>
          <Text className="text-gray-400 text-xs mt-1">
            Built with ❤️ for mindful living
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
