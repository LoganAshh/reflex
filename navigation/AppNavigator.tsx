import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import QuickLogScreen from "../screens/QuickLogScreen";
import PatternDashboard from "../screens/PatternDashboard";
import ReplacementActions from "../screens/ReplacementActions";
import StreaksScreen from "../screens/StreaksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
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

  // Enhanced home screen with history (styled to match onboarding)
  const HomeScreen = () => (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <Text className="text-3xl font-bold text-white text-center">
          Welcome back! 👋
        </Text>
        <Text className="text-xl text-white text-center mt-2 opacity-90">
          How are you feeling today?
        </Text>
      </View>

      <View className="flex-1 px-6">
        {/* Quick Stats */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            Today's Progress
          </Text>

          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-3xl font-bold text-white">
                {getTodaysLogs().length}
              </Text>
              <Text className="text-white opacity-75 text-sm">
                Urges Logged
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-white">
                {getTodaysLogs().filter((log) => !log.actedOn).length}
              </Text>
              <Text className="text-white opacity-75 text-sm">Resisted</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-white">
                {getTodaysLogs().length > 0
                  ? Math.round(
                      (getTodaysLogs().filter((log) => !log.actedOn).length /
                        getTodaysLogs().length) *
                        100
                    )
                  : 0}
                %
              </Text>
              <Text className="text-white opacity-75 text-sm">
                Success Rate
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            Quick Actions
          </Text>

          <View className="space-y-3">
            <TouchableOpacity
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
              onPress={() => setActiveTab("log")}
            >
              <Text className="text-white font-semibold text-center text-lg">
                📝 Log Urge
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
              onPress={() => setActiveTab("actions")}
            >
              <Text className="text-white font-semibold text-center text-lg">
                ⚡ Find Action
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
              onPress={() => setShowDailyCheckIn(true)}
            >
              <Text className="text-white font-semibold text-center text-lg">
                🌟 Daily Check-in
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent History */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            Recent Activity
          </Text>
          <UrgeHistory limit={3} />
        </View>
      </View>
    </SafeAreaView>
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
      <View
        className="absolute -top-1 -right-1 rounded-full min-w-5 h-5 items-center justify-center"
        style={{ backgroundColor: "#EF4444" }}
      >
        <Text className="text-white text-xs font-bold">
          {count > 99 ? "99+" : count}
        </Text>
      </View>
    );
  };

  // Show onboarding if not completed
  if (onboardingLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "#185e66" }}
      >
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  if (true) {
    return <OnboardingScreen />;
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Main Screen */}
      <View className="flex-1">{renderScreen()}</View>

      {/* Enhanced Bottom Navigation with Onboarding Style */}
      <View
        className="border-t"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderTopColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <View className="flex-row">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const badgeCount = getBadgeCount(tab.id);

            return (
              <TouchableOpacity
                key={tab.id}
                className="flex-1 py-3 items-center relative"
                style={{
                  backgroundColor: isActive
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                }}
                onPress={() => setActiveTab(tab.id)}
              >
                <View className="relative">
                  <Text className="text-2xl mb-1">{tab.icon}</Text>
                  {renderTabBadge(badgeCount)}
                </View>
                <Text
                  className={`text-sm font-medium ${
                    isActive ? "text-white" : "text-white opacity-70"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Daily Check-in Modal with Onboarding Style */}
      {showDailyCheckIn && (
        <View
          className="absolute inset-0 justify-center items-center px-6"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View
            className="rounded-2xl p-6 w-full max-w-sm border"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.3)",
            }}
          >
            <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
              Daily Check-in
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              How are you feeling today? Any urges you'd like to log?
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg"
                style={{ backgroundColor: "rgba(107, 114, 128, 0.2)" }}
                onPress={() => setShowDailyCheckIn(false)}
              >
                <Text className="text-center font-semibold text-gray-700">
                  Later
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg"
                style={{ backgroundColor: "#185e66" }}
                onPress={() => {
                  setShowDailyCheckIn(false);
                  setActiveTab("log");
                }}
              >
                <Text className="text-center font-semibold text-white">
                  Log Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AppNavigator;
