import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";

// Import the components we created (in a real app, these would be separate files)
import QuickLogScreen from "../screens/QuickLogScreen";
import PatternDashboard from "../screens/PatternDashboard";
import ReplacementActions from "../screens/ReplacementActions";

type TabType = "log" | "patterns" | "actions" | "streaks";

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("log");

  const tabs = [
    { id: "log" as TabType, label: "Log", icon: "📝" },
    { id: "patterns" as TabType, label: "Patterns", icon: "📊" },
    { id: "actions" as TabType, label: "Actions", icon: "⚡" },
    { id: "streaks" as TabType, label: "Streaks", icon: "🔥" },
  ];

  const StreaksScreen = () => (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Streaks & Wins</Text>
        <Text className="text-gray-600 mt-1">Celebrate your progress</Text>
      </View>

      <View className="flex-1 px-6 py-6">
        {/* Current Streak */}
        <View className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-6 mb-6">
          <View className="items-center">
            <Text className="text-6xl mb-2">🔥</Text>
            <Text className="text-white text-3xl font-bold">7 Days</Text>
            <Text className="text-orange-100 text-lg">Current Streak</Text>
            <Text className="text-orange-100 text-sm mt-1">
              Resisting social media urges
            </Text>
          </View>
        </View>

        {/* Recent Wins */}
        <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Recent Wins 🎉
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center p-3 bg-green-50 rounded-lg">
              <Text className="text-2xl mr-3">✅</Text>
              <View className="flex-1">
                <Text className="text-green-800 font-medium">
                  Resisted scrolling urge
                </Text>
                <Text className="text-green-600 text-sm">
                  Did breathing exercise instead • 2 hours ago
                </Text>
              </View>
            </View>

            <View className="flex-row items-center p-3 bg-green-50 rounded-lg">
              <Text className="text-2xl mr-3">🚶</Text>
              <View className="flex-1">
                <Text className="text-green-800 font-medium">
                  Took a walk instead of snacking
                </Text>
                <Text className="text-green-600 text-sm">
                  10 min walk around the block • 5 hours ago
                </Text>
              </View>
            </View>

            <View className="flex-row items-center p-3 bg-green-50 rounded-lg">
              <Text className="text-2xl mr-3">📝</Text>
              <View className="flex-1">
                <Text className="text-green-800 font-medium">
                  Journaled instead of texting ex
                </Text>
                <Text className="text-green-600 text-sm">
                  3 gratitude points • Yesterday
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Streak Goals */}
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Streak Goals
          </Text>

          <View className="space-y-4">
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-700 font-medium">
                  No doom scrolling
                </Text>
                <Text className="text-gray-500">7/30 days</Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "23%" }}
                />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-700 font-medium">
                  Mindful eating
                </Text>
                <Text className="text-gray-500">3/7 days</Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "43%" }}
                />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-700 font-medium">No vaping</Text>
                <Text className="text-gray-500">1/14 days</Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "7%" }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Motivation */}
        <View className="bg-blue-50 rounded-lg p-4 mt-6">
          <Text className="text-blue-800 font-bold text-center mb-2">
            💪 You're rewiring your brain!
          </Text>
          <Text className="text-blue-700 text-sm text-center">
            Every urge you resist strengthens your self-control. You're
            literally building new neural pathways.
          </Text>
        </View>
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
      default:
        return <QuickLogScreen />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Main Content */}
      <View className="flex-1">{renderScreen()}</View>

      {/* Bottom Navigation */}
      <View className="bg-white border-t border-gray-200 px-4 py-2">
        <View className="flex-row justify-around">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              className={`flex-1 items-center py-2 ${
                activeTab === tab.id ? "opacity-100" : "opacity-60"
              }`}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text className="text-2xl mb-1">{tab.icon}</Text>
              <Text
                className={`text-xs ${
                  activeTab === tab.id
                    ? "text-blue-600 font-medium"
                    : "text-gray-600"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MainApp;
