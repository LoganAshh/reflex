// src/navigation/AppNavigator.tsx (Enhanced Version - No Notifications)

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import QuickLogScreen from "../screens/QuickLogScreen";
import PatternDashboard from "../screens/PatternDashboard";
import ReplacementActions from "../screens/ReplacementActions";
import StreaksScreen from "../screens/StreaksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import FloatingActionButton from "../components/FloatingActionButton";
import DailyCheckIn from "../components/DailyCheckIn";
import UrgeHistory from "../components/UrgeHistory";
import { useUrgeData } from "../hooks/useUrgeData";
import { useOnboarding } from "../hooks/useOnboarding";

type TabType = "log" | "patterns" | "actions" | "streaks" | "settings";

const AppNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("log");
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);

  const { getTodaysLogs } = useUrgeData();
  const { isOnboardingCompleted, loading: onboardingLoading } = useOnboarding();

  // Check if we should show daily check-in (simplified without notifications)
  useEffect(() => {
    if (isOnboardingCompleted) {
      // Simple localStorage check for demo (in real app you'd use AsyncStorage)
      const lastCheckIn = new Date().toDateString();

      // For demo purposes, show check-in after 3 seconds on first load
      const timer = setTimeout(() => {
        // Uncomment this line if you want to test the daily check-in modal
        // setShowDailyCheckIn(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOnboardingCompleted]);

  const handleDailyCheckInComplete = () => {
    setShowDailyCheckIn(false);
    // Store completion time (in real app, use AsyncStorage)
    console.log("Daily check-in completed");
  };

  const tabs = [
    { id: "log" as TabType, label: "Log", icon: "📝" },
    { id: "patterns" as TabType, label: "Patterns", icon: "📊" },
    { id: "actions" as TabType, label: "Actions", icon: "⚡" },
    { id: "streaks" as TabType, label: "Streaks", icon: "🔥" },
    { id: "settings" as TabType, label: "Settings", icon: "⚙️" },
  ];

  // Enhanced home screen with history
  const HomeScreen = () => (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          Good morning! 👋
        </Text>
        <Text className="text-gray-600 mt-1">How are you feeling today?</Text>
      </View>

      <View className="flex-1 px-6 py-6">
        {/* Quick Stats */}
        <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Today's Progress
          </Text>

          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {getTodaysLogs().length}
              </Text>
              <Text className="text-gray-600 text-sm">Urges Logged</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {getTodaysLogs().filter((log) => !log.actedOn).length}
              </Text>
              <Text className="text-gray-600 text-sm">Resisted</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {getTodaysLogs().length > 0
                  ? Math.round(
                      (getTodaysLogs().filter((log) => !log.actedOn).length /
                        getTodaysLogs().length) *
                        100
                    )
                  : 0}
                %
              </Text>
              <Text className="text-gray-600 text-sm">Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Quick Actions
          </Text>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-blue-50 p-3 rounded-lg border border-blue-200"
              onPress={() => setActiveTab("log")}
            >
              <Text className="text-blue-700 font-medium text-center">
                📝 Log Urge
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-green-50 p-3 rounded-lg border border-green-200"
              onPress={() => setActiveTab("actions")}
            >
              <Text className="text-green-700 font-medium text-center">
                ⚡ Find Action
              </Text>
            </TouchableOpacity>
          </View>

          {/* Daily Check-in Button */}
          <TouchableOpacity
            className="bg-purple-50 p-3 rounded-lg border border-purple-200 mt-3"
            onPress={() => setShowDailyCheckIn(true)}
          >
            <Text className="text-purple-700 font-medium text-center">
              🌟 Daily Check-in
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent History */}
        <UrgeHistory limit={5} />
      </View>
    </View>
  );

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
        return <HomeScreen />;
    }
  };

  const getBadgeCount = (tabId: TabType) => {
    switch (tabId) {
      case "log":
        return getTodaysLogs().length;
      case "streaks":
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

  // Show onboarding if not completed
  if (onboardingLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!isOnboardingCompleted) {
    return <OnboardingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Main Content */}
      <View className="flex-1">{renderScreen()}</View>

      {/* Floating Action Button */}
      <FloatingActionButton
        visible={activeTab !== "log"}
        onPress={() => setActiveTab("log")}
      />

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

      {/* Daily Check-in Modal */}
      <DailyCheckIn
        visible={showDailyCheckIn}
        onComplete={handleDailyCheckInComplete}
        onDismiss={() => setShowDailyCheckIn(false)}
      />
    </SafeAreaView>
  );
};

export default AppNavigator;
