// screens/SettingsScreen.tsx - Updated with urge selection

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Modal,
} from "react-native";
import { useSettings } from "../hooks/useSettings";
import UrgeSelectionSettings from "../components/UrgeSelectionSettings";

const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, toggleNotifications } = useSettings();
  const [showUrgeSelection, setShowUrgeSelection] = useState(false);

  const settingSections = [
    {
      title: "Tracking",
      items: [
        {
          title: "Selected Urges",
          subtitle: `${settings?.selectedUrges?.length || 0} urges selected`,
          icon: "🎯",
          action: () => setShowUrgeSelection(true),
          showArrow: true,
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          title: "Enable Notifications",
          subtitle: "Daily check-ins and reminders",
          icon: "🔔",
          toggle: true,
          value: settings?.notificationsEnabled || false,
          onToggle: toggleNotifications,
        },
        {
          title: "Daily Reminder Time",
          subtitle: settings?.dailyReminderTime || "20:00",
          icon: "⏰",
          action: () => {
            // Handle time picker
            console.log("Open time picker");
          },
          showArrow: true,
          disabled: !settings?.notificationsEnabled,
        },
      ],
    },
    {
      title: "Data",
      items: [
        {
          title: "Export Data",
          subtitle: "Download your tracking data",
          icon: "📤",
          action: () => {
            // Handle export
            console.log("Export data");
          },
          showArrow: true,
        },
        {
          title: "Clear All Data",
          subtitle: "Permanently delete all logs",
          icon: "🗑️",
          action: () => {
            // Handle clear data
            console.log("Clear data");
          },
          showArrow: true,
          destructive: true,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          title: "About Reflex",
          subtitle: "Version 1.0.0",
          icon: "ℹ️",
          action: () => {
            // Handle about
            console.log("About");
          },
          showArrow: true,
        },
        {
          title: "Privacy Policy",
          subtitle: "How we protect your data",
          icon: "🔒",
          action: () => {
            // Handle privacy policy
            console.log("Privacy policy");
          },
          showArrow: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    const isDisabled = item.disabled;

    return (
      <TouchableOpacity
        key={item.title}
        className={`p-4 border-b border-gray-100 ${
          isDisabled ? "opacity-50" : ""
        }`}
        onPress={!isDisabled ? item.action : undefined}
        disabled={isDisabled}
      >
        <View className="flex-row items-center">
          <Text className="text-2xl mr-3">{item.icon}</Text>

          <View className="flex-1">
            <Text
              className={`text-lg font-medium ${
                item.destructive ? "text-red-600" : "text-gray-800"
              }`}
            >
              {item.title}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">{item.subtitle}</Text>
          </View>

          {item.toggle && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              disabled={isDisabled}
              trackColor={{ false: "#d1d5db", true: "#10B981" }}
              thumbColor="#ffffff"
            />
          )}

          {item.showArrow && !item.toggle && (
            <Text className="text-gray-400 text-xl">›</Text>
          )}
        </View>
      </TouchableOpacity>
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

      {/* Settings Content */}
      <View className="flex-1 bg-white rounded-t-3xl">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="pt-6">
            {settingSections.map((section, sectionIndex) => (
              <View key={section.title} className="mb-8">
                <Text className="text-lg font-bold text-gray-800 px-6 mb-4">
                  {section.title}
                </Text>

                <View className="bg-white mx-4 rounded-lg shadow-sm border border-gray-100">
                  {section.items.map((item, itemIndex) => (
                    <View key={item.title}>{renderSettingItem(item)}</View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* App info */}
          <View className="px-6 py-8 border-t border-gray-100">
            <Text className="text-center text-gray-500 text-sm">
              Reflex - Mindful Urge Tracking
            </Text>
            <Text className="text-center text-gray-400 text-xs mt-1">
              Build awareness, create change
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Urge Selection Modal */}
      <Modal
        visible={showUrgeSelection}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <UrgeSelectionSettings
          onClose={() => setShowUrgeSelection(false)}
          showHeader={true}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;
