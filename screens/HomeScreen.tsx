import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import UrgeHistory from "../components/UrgeHistory";
import { useUrgeData } from "../hooks/useUrgeData";

type TabType = "home" | "actions" | "log" | "analytics" | "patterns";

interface HomeScreenProps {
  setActiveTab: (tab: TabType) => void;
  setShowDailyCheckIn: (show: boolean) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setActiveTab, setShowDailyCheckIn }) => {
  const { getTodaysLogs } = useUrgeData();

  return (
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
              onPress={() => setActiveTab("log" as TabType)}
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
              onPress={() => setActiveTab("actions" as TabType)}
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
};

export default HomeScreen;