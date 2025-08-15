import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import QuickLogScreen from "../screens/QuickLogScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ReplacementActions from "../screens/ReplacementActions";
import UrgeAnalyticsScreen from "../screens/UrgeAnalyticsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import DailyCheckIn from "../components/DailyCheckIn";
import { useUrgeData } from "../hooks/useUrgeData";
import { useOnboarding } from "../hooks/useOnboarding";

export type TabType = "home" | "actions" | "log" | "analytics" | "profile";

const AppNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("home");
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
    {
      id: "home" as TabType,
      label: "Home",
      icon: "home-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      id: "actions" as TabType,
      label: "Actions",
      icon: "flash-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      id: "log" as TabType,
      label: "Log",
      icon: "add-circle-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      id: "analytics" as TabType,
      label: "Analytics",
      icon: "pulse-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      id: "profile" as TabType,
      label: "Profile",
      icon: "person-outline" as keyof typeof Ionicons.glyphMap,
    },
  ];

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen 
            setActiveTab={setActiveTab} 
            setShowDailyCheckIn={setShowDailyCheckIn} 
          />
        );
      case "actions":
        return <ReplacementActions />;
      case "log":
        return <QuickLogScreen />;
      case "analytics":
        return <UrgeAnalyticsScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return (
          <HomeScreen 
            setActiveTab={setActiveTab} 
            setShowDailyCheckIn={setShowDailyCheckIn} 
          />
        );
    }
  };

  const getBadgeCount = (tabId: TabType) => {
    switch (tabId) {
      case "log":
        return getTodaysLogs().length;
      case "analytics":
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

  if (!isOnboardingCompleted) {
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
                className="flex-1 py-4 items-center relative"
                onPress={() => setActiveTab(tab.id)}
              >
                <View className="relative">
                  <Ionicons
                    name={tab.icon}
                    size={28}
                    color={isActive ? "#10B981" : "white"}
                  />
                  {renderTabBadge(badgeCount)}
                </View>
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