import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from "react-native";

const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const renderSettingItem = (
    title: string,
    subtitle: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode,
    icon?: string
  ) => (
    <TouchableOpacity
      className="rounded-xl p-4 mb-4 border"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(255, 255, 255, 0.2)",
      }}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center">
            {icon && <Text className="text-2xl mr-3">{icon}</Text>}
            <Text className="text-white font-semibold text-lg">{title}</Text>
          </View>
          <Text className="text-white opacity-75 mt-1">{subtitle}</Text>
        </View>
        {rightComponent}
      </View>
    </TouchableOpacity>
  );

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Your data will be exported as a JSON file that you can save or share.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Export", onPress: () => console.log("Exporting data...") },
      ]
    );
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
          onPress: () => console.log("Clearing data..."),
        },
      ]
    );
  };

  const handleSetReminderTime = () => {
    Alert.alert("Daily Reminder", "Set your daily check-in reminder time", [
      { text: "Cancel", style: "cancel" },
      { text: "8:00 PM", onPress: () => console.log("Set to 8:00 PM") },
      { text: "9:00 PM", onPress: () => console.log("Set to 9:00 PM") },
      { text: "10:00 PM", onPress: () => console.log("Set to 10:00 PM") },
    ]);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <Text className="text-3xl font-bold text-white text-center">
          Settings
        </Text>
        <Text className="text-xl text-white text-center mt-2 opacity-90">
          Customize your experience
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Notifications */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-white mb-4">
            🔔 Notifications
          </Text>

          {renderSettingItem(
            "Daily Reminders",
            "Get gentle check-in reminders",
            undefined,
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "rgba(255,255,255,0.3)", true: "#10B981" }}
              thumbColor="#ffffff"
            />,
            "📱"
          )}

          {notificationsEnabled &&
            renderSettingItem(
              "Daily Reminder Time",
              "Check-in reminder at 9:00 PM",
              handleSetReminderTime,
              undefined,
              "⏰"
            )}
        </View>

        {/* App Preferences */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-white mb-4">
            ⚙️ Preferences
          </Text>

          {renderSettingItem(
            "Theme",
            "Currently using system theme",
            () => {
              Alert.alert("Theme", "Choose your preferred theme", [
                { text: "Cancel", style: "cancel" },
                { text: "Light", onPress: () => console.log("Light theme") },
                { text: "Dark", onPress: () => console.log("Dark theme") },
                { text: "System", onPress: () => console.log("System theme") },
              ]);
            },
            undefined,
            "🎨"
          )}

          {renderSettingItem(
            "Quick Actions",
            "3 favorite replacement actions",
            () => {
              Alert.alert(
                "Quick Actions",
                "Customize your favorite replacement actions for quick access."
              );
            },
            undefined,
            "⚡"
          )}
        </View>

        {/* Data & Privacy */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-white mb-4">
            🔒 Data & Privacy
          </Text>

          {renderSettingItem(
            "Export Data",
            "Download all your urge logs and statistics",
            handleExportData,
            undefined,
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
        <View className="mb-8">
          <Text className="text-2xl font-bold text-white mb-4">🔥 Streaks</Text>

          {renderSettingItem(
            "Manage Streak Goals",
            "3 active goals",
            () => {
              Alert.alert(
                "Streak Goals",
                "Manage your streak goals and targets."
              );
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
                    onPress: () => console.log("Resetting streaks..."),
                  },
                ]
              );
            },
            undefined,
            "🔄"
          )}
        </View>

        {/* Support */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-white mb-4">💬 Support</Text>

          {renderSettingItem(
            "Send Feedback",
            "Help us improve the app",
            () => {
              Alert.alert("Send Feedback", "What would you like to tell us?");
            },
            undefined,
            "📝"
          )}

          {renderSettingItem(
            "About",
            "Version 1.0.0 - Made with ❤️",
            () => {
              Alert.alert(
                "About Reflex",
                "Reflex v1.0.0\n\nYour mindful urge companion, helping you build self-awareness and transform automatic urges into conscious choices.\n\nMade with ❤️"
              );
            },
            undefined,
            "ℹ️"
          )}
        </View>

        {/* Danger Zone */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-white mb-4">
            ⚠️ Danger Zone
          </Text>

          {renderSettingItem(
            "Clear All Data",
            "Permanently delete all app data",
            handleClearData,
            undefined,
            "🗑️"
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
