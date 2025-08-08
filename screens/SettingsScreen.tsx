// screens/SettingsScreen.tsx

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
import {
  COMMON_URGES,
  COMMON_LOCATIONS,
  COMMON_TRIGGERS,
  COMMON_EMOTIONS,
} from "../types";
import { useSettings } from "../hooks/useSettings";

const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { settings, updateSettings } = useSettings();

  // Helper functions to get only the first 4 items (same as in QuickLogScreen)
  const getDefaultTriggers = () => COMMON_TRIGGERS.slice(0, 4).map((t) => t.text);
  const getDefaultLocations = () => COMMON_LOCATIONS.slice(0, 4).map((l) => l.text);
  const getDefaultEmotions = () => COMMON_EMOTIONS.slice(0, 4).map((e) => e.text);

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

  // Updated reset functions to use only first 4 items
  const resetToDefaults = async () => {
    try {
      const currentSettings = settings || {};
      
      // Reset to limited default values (first 4 of each)
      const updatedSettings = {
        ...currentSettings,
        recentTriggers: getDefaultTriggers(),
        recentLocations: getDefaultLocations(),
        recentEmotions: getDefaultEmotions(),
        // Reset custom icons
        customTriggerIcons: {},
        customLocationIcons: {},
        customEmotionIcons: {},
      };

      await updateSettings(updatedSettings);
      
      // Show confirmation
      Alert.alert(
        "Reset Complete",
        "Triggers, locations, and emotions have been reset to 4 default options each.",
        [{ text: "OK" }]
      );
      
      console.log("Successfully reset to limited defaults");
    } catch (error) {
      console.error("Error resetting to defaults:", error);
      Alert.alert(
        "Error",
        "Failed to reset to defaults. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const resetTriggersToDefault = async () => {
    try {
      const currentSettings = settings || {};
      const updatedSettings = {
        ...currentSettings,
        recentTriggers: getDefaultTriggers(),
        customTriggerIcons: {},
      };
      await updateSettings(updatedSettings);
      Alert.alert("Reset Complete", "Triggers have been reset to 4 default options.");
    } catch (error) {
      console.error("Error resetting triggers:", error);
      Alert.alert("Error", "Failed to reset triggers.");
    }
  };

  const resetLocationsToDefault = async () => {
    try {
      const currentSettings = settings || {};
      const updatedSettings = {
        ...currentSettings,
        recentLocations: getDefaultLocations(),
        customLocationIcons: {},
      };
      await updateSettings(updatedSettings);
      Alert.alert("Reset Complete", "Locations have been reset to 4 default options.");
    } catch (error) {
      console.error("Error resetting locations:", error);
      Alert.alert("Error", "Failed to reset locations.");
    }
  };

  const resetEmotionsToDefault = async () => {
    try {
      const currentSettings = settings || {};
      const updatedSettings = {
        ...currentSettings,
        recentEmotions: getDefaultEmotions(),
        customEmotionIcons: {},
      };
      await updateSettings(updatedSettings);
      Alert.alert("Reset Complete", "Emotions have been reset to 4 default options.");
    } catch (error) {
      console.error("Error resetting emotions:", error);
      Alert.alert("Error", "Failed to reset emotions.");
    }
  };

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

  const handleResetMenuOptions = () => {
    Alert.alert(
      "Reset Options",
      "Choose what to reset to 4 default options:",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset All", onPress: () => confirmResetAll() },
        { text: "Reset Triggers", onPress: () => confirmResetTriggers() },
        { text: "Reset Locations", onPress: () => confirmResetLocations() },
        { text: "Reset Emotions", onPress: () => confirmResetEmotions() },
      ]
    );
  };

  const confirmResetAll = () => {
    Alert.alert(
      "Confirm Reset All",
      "This will reset all triggers, locations, emotions, and custom icons to 4 default options each. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset All", style: "destructive", onPress: resetToDefaults },
      ]
    );
  };

  const confirmResetTriggers = () => {
    Alert.alert(
      "Confirm Reset Triggers",
      "This will reset triggers and their custom icons to 4 default options. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: resetTriggersToDefault },
      ]
    );
  };

  const confirmResetLocations = () => {
    Alert.alert(
      "Confirm Reset Locations",
      "This will reset locations and their custom icons to 4 default options. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: resetLocationsToDefault },
      ]
    );
  };

  const confirmResetEmotions = () => {
    Alert.alert(
      "Confirm Reset Emotions",
      "This will reset emotions and their custom icons to 4 default options. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: resetEmotionsToDefault },
      ]
    );
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

        {/* Data Management */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-white mb-4">
            🔄 Data Management
          </Text>

          {renderSettingItem(
            "Reset to Defaults",
            "Reset to 4 triggers, locations, and emotions",
            handleResetMenuOptions,
            undefined,
            "🔄"
          )}

          {renderSettingItem(
            "Manage Urges",
            `${settings?.selectedUrges?.length || 0} urges selected`,
            () => {
              Alert.alert(
                "Manage Urges",
                "Go to the urge selection screen to customize which urges you want to track."
              );
            },
            undefined,
            "🎯"
          )}

          {renderSettingItem(
            "Current Options",
            `${(settings as any)?.recentTriggers?.length || 4} triggers, ${(settings as any)?.recentLocations?.length || 4} locations, ${(settings as any)?.recentEmotions?.length || 4} emotions`,
            () => {
              const triggerCount = (settings as any)?.recentTriggers?.length || 4;
              const locationCount = (settings as any)?.recentLocations?.length || 4;
              const emotionCount = (settings as any)?.recentEmotions?.length || 4;
              
              Alert.alert(
                "Current Options",
                `You currently have:\n• ${triggerCount} triggers\n• ${locationCount} locations\n• ${emotionCount} emotions\n\nUse "Reset to Defaults" to reduce to 4 each.`
              );
            },
            undefined,
            "📊"
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