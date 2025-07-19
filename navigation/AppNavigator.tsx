// src/navigation/AppNavigator.tsx

import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import QuickLogScreen from "../screens/QuickLogScreen";
import PatternDashboard from "../screens/PatternDashboard";
import ReplacementActions from "../screens/ReplacementActions";
import StreaksScreen from "../screens/StreaksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useUrgeData } from "../hooks/useUrgeData";

type TabType = "log" | "patterns" | "actions" | "streaks" | "settings";

const AppNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>("log");
  const { getTodaysLogs } = useUrgeData();

  const tabs = [
    { id: "log" as TabType, label: "Log", icon: "📝" },
    { id: "patterns" as TabType, label: "Patterns", icon: "📊" },
    { id: "actions" as TabType, label: "Actions", icon: "⚡" },
    { id: "streaks" as TabType, label: "Streaks", icon: "🔥" },
    { id: "settings" as TabType, label: "Settings", icon: "⚙️" },
  ];

  const renderScreen = () => {
    switch (activeTab) {
      case "log":
        return <QuickLogScreen />;
      case "patterns":
        return <PatternDashboard />;
      case "actions":
        return <ReplacementActions />;
      case "streaks":
        return <StreaksScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <QuickLogScreen />;
    }
  };

  const getBadgeCount = (tabId: TabType) => {
    switch (tabId) {
      case "log":
        // Show today's log count
        return getTodaysLogs().length;
      case "streaks":
        // Show today's wins count
        return getTodaysLogs().filter((log) => !log.actedOn).length;
      default:
        return 0;
    }
  };

  const renderTabBadge = (count: number) => {
    if (count === 0) return null;

    return (
      <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 items-center justify-center">
        <Text className="text-white text-xs font-bold">
          {count > 99 ? "99+" : count}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Main Content */}
      <View className="flex-1">{renderScreen()}</View>

      {/* Enhanced Bottom Navigation */}
      <View className="bg-white border-t border-gray-200 px-2 py-1">
        <View className="flex-row justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const badgeCount = getBadgeCount(tab.id);

            return (
              <TouchableOpacity
                key={tab.id}
                className={`flex-1 items-center py-2 px-1 relative ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
                onPress={() => setActiveTab(tab.id)}
              >
                <View className="relative">
                  <Text className="text-2xl mb-1">{tab.icon}</Text>
                  {renderTabBadge(badgeCount)}
                </View>
                <Text
                  className={`text-xs ${
                    isActive ? "text-blue-600 font-medium" : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AppNavigator;
