import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useUrgeData } from "../hooks/useUrgeData";

const StreaksScreen: React.FC = () => {
  const { getTodaysLogs } = useUrgeData();
  const todaysLogs = getTodaysLogs();
  const todaysWins = todaysLogs.filter((log) => !log.actedOn);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Streaks & Wins</Text>
        <Text className="text-gray-600 mt-1">Celebrate your progress</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Today's Summary */}
        <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            📅 Today's Summary
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {todaysLogs.length}
              </Text>
              <Text className="text-gray-600 text-sm">Total Urges</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {todaysWins.length}
              </Text>
              <Text className="text-gray-600 text-sm">Resisted</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {todaysLogs.length > 0
                  ? Math.round((todaysWins.length / todaysLogs.length) * 100)
                  : 0}
                %
              </Text>
              <Text className="text-gray-600 text-sm">Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Current Streak */}
        <View className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-6 mb-6">
          <View className="items-center">
            <Text className="text-6xl mb-2">🔥</Text>
            <Text className="text-white text-3xl font-bold">7 Days</Text>
            <Text className="text-orange-100 text-lg">Current Streak</Text>
            <Text className="text-orange-100 text-sm mt-1">
              Mindful urge awareness
            </Text>
          </View>
        </View>

        {/* Recent Wins */}
        <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Recent Wins 🎉
          </Text>

          {todaysWins.length > 0 ? (
            <View className="space-y-3">
              {todaysWins.slice(0, 3).map((log, index) => (
                <View
                  key={log.id}
                  className="flex-row items-center p-3 bg-green-50 rounded-lg"
                >
                  <Text className="text-2xl mr-3">✅</Text>
                  <View className="flex-1">
                    <Text className="text-green-800 font-medium">
                      Resisted {log.urge.toLowerCase()}
                    </Text>
                    <Text className="text-green-600 text-sm">
                      {log.replacementAction || "Used willpower"} •{" "}
                      {log.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center py-4">
              <Text className="text-gray-500 text-center">
                No wins logged today yet.{"\n"}
                Keep going - you've got this! 💪
              </Text>
            </View>
          )}
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
                <Text className="text-gray-700 font-medium">
                  Digital wellness
                </Text>
                <Text className="text-gray-500">5/14 days</Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "36%" }}
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
      </ScrollView>
    </View>
  );
};

export default StreaksScreen;
